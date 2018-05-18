import { BillCollection, Bill } from "../models/models";



export namespace BillCollectionHelpers
{
    export function computeTotal(...billCollections: BillCollection[]): number
    {
        return billCollections.reduce((p, c) => p + BillHelpers.computeTotal(...c.bills), 0);
    }
}


export namespace BillHelpers
{
    export function computeTotal(...bills: Bill[]): number
    {
        return bills.reduce((p, c) => p + (c.totalAmount || 0), 0);
    }

    export function getSplitAmount(total: number, bills: Bill[])
    {
        let amount = 0;

        for (var bill of bills)
        {
            for (var split of (bill.splits || []))
            {
                if (split.splitAmount !== undefined && split.splitAmount !== null)
                {
                    amount += split.splitAmount;
                }
                else
                {
                    amount += total * ((split.splitPercent || 0) / 100);
                }
            }
        }

        return amount;
    }
}