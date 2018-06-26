



export interface Person
{
    personId: number;
    name?: string;
    splits?: Split[];
}

export interface BillCollection
{
    billCollectionId: number;
    date: string;
    bills: Bill[];
}

export interface Bill
{
    billId: number;
    billCollectionId: number;
    personId?: number;
    supplierId?: number;
    totalAmount?: number;
    billDate: string;
    splits?: Split[];
    comment?: string;
}

export interface Split
{
    billId: number;
    personId: number;
    splitPercent?: number;
    splitAmount?: number;
}

export interface Supplier
{
    supplierId: number;
    name?: string;
}

export interface Payment
{
    paymentId: number;
    date: string;
    amount: number;
    senderPersonId?: number;
    receiverPersonId?: number;
}

export interface Expenditure
{
    supplierId: number;
    personId: number;
    avgPerVisit: number;
    avgPerMonth: number;
    totalSpend: number;
}