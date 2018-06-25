import * as React from 'react';

import { BillCollection, Person, Supplier, Bill } from "../models/models";

type TableRow = {
    supplierId: number,
    avgPerVisit: number,
    avgPerMonth: number,
    total: number,
};

interface ExpenditureComponentProps
{
    persons: Person[];
    suppliers: Supplier[];
    billCollections: BillCollection[];
}

interface ExpenditureComponentState
{
    loading: boolean;
    list: TableRow[];
}



export class ExpenditureComponent extends React.Component<ExpenditureComponentProps, ExpenditureComponentState>
{
    constructor(props: ExpenditureComponentProps)
    {
        super(props);

        this.state = {
            list: [],
            loading: true,
        };
    }

    componentWillMount()
    {
        const { persons, suppliers, billCollections } = this.props;

        this.setState({
            loading: false,
            list: ExpenditureComponent._buildList(persons, suppliers, billCollections),
        });
    }

    render()
    {
        const { billCollections, persons, suppliers } = this.props;
        const { loading, list } = this.state;

        return (
            !loading
                ?
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4>Expenditures</h4>
                    </div>
                    <table className="table">
                        <thead>
                            <tr className="no-wrap">
                                <th className="td-shrink"></th>
                                <th>Supplier</th>
                                <th className="td-shrink">Ave/visit</th>
                                <th className="td-shrink">Ave/month</th>
                                <th className="td-shrink">Total spend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length > 0
                                ?
                                list.map(item => (
                                    <tr>
                                        <td></td>
                                        <td>{suppliers.find(s => s.supplierId == item.supplierId)!.name}</td>
                                        <td className="text-right">${item.avgPerVisit.toFixed(2)}</td>
                                        <td className="text-right">${item.avgPerMonth.toFixed(2)}</td>
                                        <td className="text-right">${item.total.toFixed(2)}</td>
                                    </tr>
                                ))
                                :
                                (
                                    <tr>
                                        <td></td>
                                        <td colSpan={4}>No items</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                :
                <div>Loading...</div>
        );
    }

    static _buildList(persons: Person[], suppliers: Supplier[], billCollections: BillCollection[]): TableRow[]
    {
        const result: TableRow[] = [];
        const sortedSuppliers = suppliers
            .sort((a, b) => a.name! < b.name! ? -1 : a.name! > b.name! ? 1 : 0)
            .filter(s => billCollections.some(bc => bc.bills.some(b => b.supplierId == s.supplierId)));

        for (const supplier of sortedSuppliers)
        {
            const total = billCollections
                .reduce((total, bc) => bc.bills
                    .filter(b => b.supplierId == supplier.supplierId)
                    .reduce((p, b) => p + (b.totalAmount || 0), 0)
                    , 0);

            const avgPerVisit = total / billCollections.reduce((p, bc) => p + bc.bills.filter(b => b.supplierId == supplier.supplierId).length, 0);

            const totalPerMonth = billCollections
                .reduce<Bill[][]>((rv, bc) =>
                {
                    (rv[new Date(bc.date).getMonth()] = rv[new Date(bc.date).getMonth()] || []).push(...bc.bills);
                    return rv;
                }, [])
                .map(monthCollection => monthCollection
                    .filter(b => b.supplierId == supplier.supplierId)
                    .reduce((p, b) => p + (b.totalAmount || 0), 0));

            const avgPerMonth = totalPerMonth.reduce((p, c) => p + c, 0) / totalPerMonth.length;

            const row: TableRow = {
                supplierId: supplier.supplierId,
                total: total,
                avgPerVisit: avgPerVisit,
                avgPerMonth: avgPerMonth
            };

            result.push(row);
        }

        return result;
    }

}