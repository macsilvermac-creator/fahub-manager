
import { Transaction, Invoice, EventSale } from '../types';
import { firebaseDataService } from './firebaseDataService';

const TRANSACTIONS_KEY = 'gridiron_transactions';
const INVOICES_KEY = 'gridiron_invoices';
const SALES_KEY = 'gridiron_event_sales';

const dateReviver = (key: string, value: any) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
    }
    return value;
};

export const financeService = {
    getTransactions: (): Transaction[] => {
        const stored = localStorage.getItem(TRANSACTIONS_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },

    saveTransactions: (txs: Transaction[]) => {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
        firebaseDataService.syncTransactions(txs).catch(console.error);
    },

    getInvoices: (): Invoice[] => {
        const stored = localStorage.getItem(INVOICES_KEY); 
        return stored ? JSON.parse(stored, dateReviver) : [];
    },

    saveInvoices: (inv: Invoice[]) => {
        localStorage.setItem(INVOICES_KEY, JSON.stringify(inv));
    },

    getEventSales: (): EventSale[] => {
        const stored = localStorage.getItem(SALES_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },

    saveEventSales: (s: EventSale[]) => {
        localStorage.setItem(SALES_KEY, JSON.stringify(s));
    },

    createBulkInvoices: (playerIds: number[], title: string, amount: number, dueDate: Date, category: string, playersList: any[], inventoryItemId?: string) => {
        const invoices = financeService.getInvoices();
        const newInvoices: Invoice[] = playerIds.map(id => {
            const player = playersList.find((p:any) => p.id === id);
            return {
                id: `inv-${Date.now()}-${id}-${Math.random().toString(36).substr(2,9)}`,
                playerId: id,
                playerName: player?.name || 'Atleta',
                title,
                amount,
                dueDate,
                status: 'PENDING',
                // Fix: Ensuring category property is correctly typed
                category: category as any,
                inventoryItemId
            };
        });
        financeService.saveInvoices([...invoices, ...newInvoices]);
    },

    processInvoicePayment: (invoiceId: string) => {
        const invoices = financeService.getInvoices();
        const targetInv = invoices.find(i => i.id === invoiceId);
        if (!targetInv || targetInv.status === 'PAID') return;

        const updatedInvoices = invoices.map(i => i.id === invoiceId ? { ...i, status: 'PAID' as const } : i);
        financeService.saveInvoices(updatedInvoices);

        const newTx: Transaction = {
            id: `tx-auto-${Date.now()}`,
            title: `Recebimento: ${targetInv.title}`,
            amount: targetInv.amount,
            type: 'INCOME',
            // Fix: category check from Invoice
            category: targetInv.category || 'TUITION',
            date: new Date(),
            status: 'PAID'
        };
        financeService.saveTransactions([newTx, ...financeService.getTransactions()]);
    },

    processPayroll: (staffId: string, amount: number, staffName: string) => {
        const newTx: Transaction = {
            id: `tx-payroll-${Date.now()}`,
            title: `Salário: ${staffName}`,
            amount: amount,
            type: 'EXPENSE',
            category: 'OTHER',
            date: new Date(),
            status: 'PAID'
        };
        financeService.saveTransactions([newTx, ...financeService.getTransactions()]);
    }
};