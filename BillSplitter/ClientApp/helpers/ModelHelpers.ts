import { BillCollection, Bill, Person, Split } from "../models/models";
import { Ensure } from '@michaelcoxon/ensure';


export namespace BillCollectionHelpers
{
    export function computeTotal(...billCollections: BillCollection[]): number
    {
        Ensure.arg(billCollections, "billCollections").isNotNullOrUndefinedOrEmpty();

        return billCollections.reduce((p, c) => p + BillHelpers.computeTotal(...c.bills), 0);
    }
}


export namespace BillHelpers
{
    export function computeTotal(...bills: Bill[]): number
    {
        if (bills === undefined || bills === null)
        {
            return 0;
        }

        return bills.reduce((p, c) => p + (c.totalAmount || 0), 0);
    }

    export function getSplitAmount(bills: Bill[]): number
    {
        if (bills === undefined || bills === null)
        {
            return 0;
        }
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
        Ensure.arg(bill, "bill").isNotNullOrUndefined();
        Ensure.arg(split, "split").isNotNullOrUndefined();

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
        Ensure.arg(persons, "persons").isNotNullOrUndefinedOrEmpty();
        Ensure.arg(split, "split").isNotNullOrUndefined();

        return `${persons.find(p => p.personId == split.personId)!.name} ${getSplitLabel(split)}`;
    }

    export function getSplitLabel(split: Split): string | undefined
    {
        Ensure.arg(split, "split").isNotNullOrUndefined();

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