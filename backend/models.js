const mongoose = require('mongoose');

// 1. Group Schema
const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: String, required: true }],
    userId: { type: String } // links group to a logged-in user
}, { timestamps: true });

// 2. Expense Schema
const ExpenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    splitBetween: [{ type: String }]
}, { timestamps: true });

const Group = mongoose.model('Group', GroupSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = { Group, Expense };
