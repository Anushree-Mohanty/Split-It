import {
  Group,
  GroupDetail,
  Expense,
  CreateGroupPayload,
  CreateExpensePayload,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function getGroups(userId: string): Promise<Group[]> {
  return fetchJSON<Group[]>(`${BASE_URL}/api/groups?userId=${encodeURIComponent(userId)}`);
}

export async function getGroup(id: string): Promise<GroupDetail> {
  return fetchJSON<GroupDetail>(`${BASE_URL}/api/groups/${id}`);
}

export async function createGroup(payload: CreateGroupPayload): Promise<Group> {
  return fetchJSON<Group>(`${BASE_URL}/api/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function createExpense(payload: CreateExpensePayload): Promise<Expense> {
  return fetchJSON<Expense>(`${BASE_URL}/api/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateExpense(
  id: string,
  payload: { description: string; amount: number; paidBy: string }
): Promise<Expense> {
  return fetchJSON<Expense>(`${BASE_URL}/api/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteExpense(id: string): Promise<void> {
  return fetchJSON<void>(`${BASE_URL}/api/expenses/${id}`, { method: 'DELETE' });
}
