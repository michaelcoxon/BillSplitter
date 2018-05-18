



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
    splits?: Split[];
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