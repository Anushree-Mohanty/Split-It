const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { Group, Expense } = require('./models');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully connected to MongoDB Atlas!"))
    .catch(err => console.error("MongoDB connection error:", err));

// 1. Get groups — filtered by userId if provided
app.get('/api/groups', async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = userId ? { userId } : {};
        const allGroups = await Group.find(filter).sort({ createdAt: -1 });
        res.json(allGroups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get a single group with smart calculated balances based on participants
app.get('/api/groups/:id', async (req, res) => {
    try {
        const groupId = req.params.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const groupExpenses = await Expense.find({ groupId }).sort({ createdAt: -1 });

        let balances = {};
        group.members.forEach(member => { balances[member] = 0; });

        groupExpenses.forEach(expense => {
            // 🚀 MODIFIED: Use splitBetween array if specified, otherwise fall back to all members
            const consumers = expense.splitBetween && expense.splitBetween.length > 0 
                ? expense.splitBetween 
                : group.members;

            const splitAmount = expense.amount / consumers.length;
            
            // Deduct from only the members who were actually part of this expense
            consumers.forEach(member => { 
                if (balances[member] !== undefined) {
                    balances[member] -= splitAmount; 
                }
            });

            // Credit the full amount back to the person who paid
            if (balances[expense.paidBy] !== undefined) {
                balances[expense.paidBy] += expense.amount;
            }
        });

        const debtors = [];
        const creditors = [];

        // 1. Separate members based on their calculated net balances
        Object.entries(balances).forEach(([name, amount]) => {
            if (amount < -0.01) {
                debtors.push({ name, amount: Math.abs(amount) });
            } else if (amount > 0.01) {
                creditors.push({ name, amount });
            }
        });

        // 2. Sort individuals so largest values are resolved first
        debtors.sort((a, b) => b.amount - a.amount);
        creditors.sort((a, b) => b.amount - a.amount);

        const settlements = [];
        let d = 0;
        let c = 0;

        // 3. Pair debtors and creditors together greedily
        while (d < debtors.length && c < creditors.length) {
            const debtor = debtors[d];
            const creditor = creditors[c];

            const payment = Math.min(debtor.amount, creditor.amount);

            settlements.push({
                from: debtor.name,
                to: creditor.name,
                amount: parseFloat(payment.toFixed(2))
            });

            debtor.amount -= payment;
            creditor.amount -= payment;

            if (debtor.amount < 0.01) d++;
            if (creditor.amount < 0.01) c++;
        }

        res.json({
            group: { id: group._id, name: group.name, members: group.members },
            expenses: groupExpenses,
            balances,
            settlements
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Create expense — accepts splitBetween targets array
app.post('/api/expenses', async (req, res) => {
    try {
        const { groupId, description, amount, paidBy, splitBetween } = req.body;
        if (!groupId || !description || !amount || !paidBy) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // 🚀 MODIFIED: Included splitBetween field in the database creation payload
        const newExpense = await Expense.create({ 
            groupId, 
            description, 
            amount: Number(amount), 
            paidBy,
            splitBetween: splitBetween || [] 
        });
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Update expense — accepts updated splitBetween targets array
app.put('/api/expenses/:id', async (req, res) => {
    try {
        const { description, amount, paidBy, splitBetween } = req.body;
        if (!description || !amount || !paidBy) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // 🚀 MODIFIED: Included splitBetween field in the update query
        const updated = await Expense.findByIdAndUpdate(
            req.params.id,
            { description, amount: Number(amount), paidBy, splitBetween: splitBetween || [] },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Expense not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const deleted = await Expense.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Expense not found" });
        res.json({ message: "Expense deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Create group — store userId so it belongs to that user
app.post('/api/groups', async (req, res) => {
    try {
        const { name, members, userId } = req.body;
        if (!name || !members || members.length === 0) {
            return res.status(400).json({ message: "Group name and members are required" });
        }
        const newGroup = await Group.create({ name, members, userId });
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));