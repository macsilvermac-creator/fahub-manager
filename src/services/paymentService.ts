
import { PaymentTransaction, PaymentMethod } from '../types';

// Mock Gateway Service (Simulating integration with Asaas/Stripe/Pagar.me)

export const paymentService = {
    // 1. Calculate Split (Our Business Model)
    calculateFees: (amount: number) => {
        const platformRate = 0.05; // 5% Take Rate
        const fixedFee = 0.50; // R$ 0.50 per transaction
        
        const platformFee = (amount * platformRate) + fixedFee;
        const netAmount = amount - platformFee;
        
        return {
            platformFee: Number(platformFee.toFixed(2)),
            netAmount: Number(netAmount.toFixed(2))
        };
    },

    // 2. Generate PIX (Simulated)
    generatePix: async (amount: number, description: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return {
            transactionId: `pix-${Date.now()}`,
            qrCodeImage: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540${amount.toFixed(2).replace('.', '')}5802BR5913GridironOS6008Brasilia62070503***6304ABCD`,
            copyPasteCode: `00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540${amount}5802BR5913GridironOS6008Brasilia62070503***6304ABCD`,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
        };
    },

    // 3. Process Credit Card (Simulated)
    processCreditCard: async (cardData: any, amount: number) => {
        // Simulate API network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock Validation logic
        if (cardData.number.endsWith('0000')) {
            throw new Error('Cartão recusado pela operadora.');
        }

        const fees = paymentService.calculateFees(amount);

        const transaction: PaymentTransaction = {
            id: `tx-${Date.now()}`,
            amount: amount,
            method: 'CREDIT_CARD',
            status: 'APPROVED',
            createdAt: new Date(),
            platformFee: fees.platformFee,
            netAmount: fees.netAmount
        };

        return transaction;
    },

    // 4. Confirm PIX Payment (Simulate Webhook)
    checkPixStatus: async (transactionId: string) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return 'APPROVED';
    }
};
