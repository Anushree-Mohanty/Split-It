export interface Group {
  _id: string;
  name: string;
  members: string[];
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  paidBy: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface GroupDetail {
  group: {
    id: string;
    name: string;
    members: string[];
  };
  expenses: Expense[];
  balances: Record<string, number>;
  settlements: Settlement[];
}

export interface CreateGroupPayload {
  name: string;
  members: string[];
  userId: string;
}

export interface CreateExpensePayload {
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween?: string[];
}

export interface PersonalExpense {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  userId: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}
