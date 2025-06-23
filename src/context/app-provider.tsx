"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Expense, Category } from '@/lib/definitions';
import { Plus, Utensils, ShoppingCart, Car, Home, Film, Briefcase, Heart, Book, Sparkles } from 'lucide-react';

type AppContextType = {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Groceries', icon: 'ShoppingCart' },
  { id: 'cat-2', name: 'Dining', icon: 'Utensils' },
  { id: 'cat-3', name: 'Transportation', icon: 'Car' },
  { id: 'cat-4', name: 'Utilities', icon: 'Home' },
  { id: 'cat-5', name: 'Entertainment', icon: 'Film' },
  { id: 'cat-6', name: 'Work', icon: 'Briefcase'},
  { id: 'cat-7', name: 'Healthcare', icon: 'Heart'},
  { id: 'cat-8', name: 'Education', icon: 'Book'},
  { id: 'cat-9', name: 'Personal Care', icon: 'Sparkles'},
  { id: 'cat-10', name: 'Miscellaneous', icon: 'Plus'},
];

const initialExpenses: Expense[] = [
    { id: 'exp-1', description: 'Monthly groceries', amount: 150.75, category: 'Groceries', date: new Date(new Date().setDate(new Date().getDate()-2)).toISOString().split('T')[0] },
    { id: 'exp-2', description: 'Dinner with friends', amount: 55.00, category: 'Dining', date: new Date(new Date().setDate(new Date().getDate()-5)).toISOString().split('T')[0] },
    { id: 'exp-3', description: 'Gasoline for car', amount: 40.20, category: 'Transportation', date: new Date(new Date().setDate(new Date().getDate()-10)).toISOString().split('T')[0] },
    { id: 'exp-4', description: 'Electricity bill', amount: 75.50, category: 'Utilities', date: new Date(new Date().setMonth(new Date().getMonth()-1)).toISOString().split('T')[0] },
    { id: 'exp-5', description: 'Movie tickets', amount: 25.00, category: 'Entertainment', date: new Date(new Date().setMonth(new Date().getMonth()-1)).toISOString().split('T')[0] },
];

function useSafeLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useSafeLocalStorage<Expense[]>('expenses', initialExpenses);
  const [categories, setCategories] = useSafeLocalStorage<Category[]>('categories', initialCategories);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Set initial data if local storage is empty
  useEffect(() => {
    if (isMounted) {
        const storedExpenses = localStorage.getItem('expenses');
        if (!storedExpenses || JSON.parse(storedExpenses).length === 0) {
            localStorage.setItem('expenses', JSON.stringify(initialExpenses));
            setExpenses(initialExpenses);
        }

        const storedCategories = localStorage.getItem('categories');
        if (!storedCategories || JSON.parse(storedCategories).length === 0) {
            localStorage.setItem('categories', JSON.stringify(initialCategories));
            setCategories(initialCategories);
        }
    }
  }, [isMounted, setExpenses, setCategories]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: `exp-${new Date().getTime()}` };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
  };
  
  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };
  
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: `cat-${new Date().getTime()}` };
    setCategories(prev => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AppContext.Provider value={{
      expenses, setExpenses, addExpense, updateExpense, deleteExpense,
      categories, setCategories, addCategory, deleteCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const iconMap: { [key: string]: React.ElementType } = {
  Plus, Utensils, ShoppingCart, Car, Home, Film, Briefcase, Heart, Book, Sparkles
};

export const getIcon = (iconName: string) => {
  const Icon = iconMap[iconName];
  return Icon ? <Icon className="h-4 w-4" /> : <Plus className="h-4 w-4" />;
};
