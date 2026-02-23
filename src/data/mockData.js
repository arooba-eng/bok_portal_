export const users = [
    {
        userId: 'Arooba123',
        password: '123',
        name: 'Arooba Khan',
        role: 'user',
        hierarchy: 'Maker',
        institutionId: 'INST001',
        accountNumber: 'PK12BOKK12345678901234',
        email: 'aroobakhan@innovarge.com',
        otp: '123456',
        accounts: [
            { accountNumber: 'PK12BOKK12345678901234', title: 'Corporate Current Account' },
            { accountNumber: 'PK12BOKK00001111222233', title: 'Payroll Account' }
        ]
    },
    {
        userId: 'tassawur',
        password: '123456',
        name: 'Tassawur Hussain',
        role: 'user',
        hierarchy: 'Checker/Approver',
        institutionId: 'INST001',
        accountNumber: 'PK12BOKK12345678901234',
        email: 'tasawur@kuickpay.com',
        otp: '123456',
        accounts: [
            { accountNumber: 'PK12BOKK12345678901234', title: 'Corporate Current Account' }
        ]
    },
    {
        userId: 'admin',
        password: 'admin123',
        name: 'Bank Administrator',
        role: 'admin',
        email: 'admin@bok.com.pk'
    }
];

export const initialInstitutions = [
    { id: 'INST001', name: 'Innovarge Tech', type: 'Corporate', status: 'Active', onboardedDate: '2023-01-15', balance: 154500 },
    { id: 'INST002', name: 'Kuickpay Solutions', type: 'FSP', status: 'Active', onboardedDate: '2023-03-20', balance: 500000},
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
