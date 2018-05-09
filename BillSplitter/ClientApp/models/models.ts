



export interface Person
{
    personId: number;
    name?: string;
}

export interface BillCollection
{
    billCollectionId: number;
    date: Date;
    bills: Bill[];
}

export interface Bill
{
    billId: number;
    totalAmount?: number;
    supplier?: Supplier
    paidBy?: Person
    splitWith?: Split[];
}

export interface Split
{
    bill: Bill;
    person?: Person;
    splitPercent?: number;
    splitAmount?: number;
}

export interface Supplier
{
    supplierId: number;
    name?: string;
}