import { BillCollection, Bill, Person, Split } from "../models/models";



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

    export function getSplitAmount(bills: Bill[]): number
    {
        let amount = 0;

        for (var bill of bills)
        {
            for (var split of (bill.splits || []))
            {
                amount += getSingleSplitAmount(bill, split);
            }
        }

        return amount;
    }

    export function getSingleSplitAmount(bill: Bill, split: Split): number
    {
        if (split.splitAmount !== undefined && split.splitAmount !== null)
        {
            return split.splitAmount;
        }
        else
        {
            return (bill.totalAmount || 0) * ((split.splitPercent || 0) / 100);
        }
    }

    export function getSplitLabelForSplit(persons: Person[], split: Split): string
    {
        return `${persons.find(p => p.personId == split.personId)!.name} ${getSplitLabel(split)}`;
    }

    export function getSplitLabel(split: Split): string | undefined
    {
        let splitLabel: string | undefined;

        if (split.splitAmount !== undefined && split.splitAmount !== null)
        {
            splitLabel = `$${split.splitAmount.toFixed(2)}`;
        }
        else if (split.splitPercent !== undefined && split.splitPercent !== null)
        {
            splitLabel = `${split.splitPercent.toFixed(2)}%`;
        }

        if (splitLabel !== null)
        {
            return `(${splitLabel})`;
        }
        else
        {
            return undefined;
        }
    }

}