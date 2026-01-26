export const users = [
    {
        userId: 'Arooba123',
        password: '123',
        name: 'Arooba Khan',
        accountNumber: 'PK12BOKK12345678901234',
        balance: 500000,
        email: 'aroobakhan@innovarge.com',
        otp: '123456'
    },
    {
        userId: 'tasawur',
        password: '123456',
        name: 'Tasawur Hussain',
        accountNumber: 'PK99BOKK98765432109876',
        balance: 10000000,
        email: 'tasawur@kuickpay.com',
        otp: '123456'
    }
];

export const banks = [
    { code: 'BOK', name: 'Bank of Khyber' },
    { code: 'HBL', name: 'Habib Bank Limited' },
    { code: 'MCB', name: 'MCB Bank Limited' },
    { code: 'ABL', name: 'Allied Bank Limited' },
    { code: 'UBL', name: 'United Bank Limited' },
    { code: 'MEEZAN', name: 'Meezan Bank' },
    { code: 'BAHL', name: 'Bank Al Habib' },
];

export const initialTransactions = [
    { id: 1, date: '2023-10-25', description: 'Funds Transfer to HBL', amount: -6000, type: 'debit' },
    { id: 2, date: '2023-10-24', description: 'Bill Payment - K-Electric', amount: -4500, type: 'debit' },
    { id: 3, date: '2023-10-20', description: 'Salary Credit', amount: 150000, type: 'credit' },
];
