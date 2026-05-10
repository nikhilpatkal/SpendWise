import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TransactionType = 'expense' | 'income' | 'transfer';
//This is the type of transaction that we will be storing in the store
export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    note: string;
    categoryId: number;
    date: string; // ISO String format
}

interface TransactionState {
    transactions: Transaction[];//This is an array of transactions that will be stored in the store
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;//This is a function that adds a new transaction to the store and we are not passing the id and date because it will be generated automatically in the store .Omit is a utility type that creates a new type by omitting the specified properties from the original type
}

export const useTransactionStore = create<TransactionState>()(
    persist( //This is a middleware that will persist the state of the store in AsyncStorage
        (set) => ({
            transactions: [],
            addTransaction: (newTx) => set((state) => {
                const txWithId: Transaction = {
                    ...newTx,
                    id: Date.now().toString() + Math.random().toString(36).substring(7),
                    date: new Date().toISOString(),
                };
                return {
                    transactions: [...state.transactions, txWithId],
                };
            }),
        }),
        {
            name: 'spendwise-transactions-storage', // unique name for AsyncStorage
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
