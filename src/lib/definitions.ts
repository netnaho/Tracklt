export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};
