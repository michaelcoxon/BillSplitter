import * as React from 'react';
import { Queryable } from '@michaelcoxon/collections'
import { BillCollection, Person, Supplier, Bill, Expenditure } from "../models/models";


interface ExpenditureComponentProps
{
    persons: Person[];
    suppliers: Supplier[];
    expenditures: Expenditure[];
}

interface TableRow
{
    showChildren: boolean;
    supplierId: number;
    avgPerVisit: number;
    avgPerMonth: number;
    totalSpend: number;
    children: {
        personId: number;
        avgPerVisit: number;
        avgPerMonth: number;
        totalSpend: number;
    }[]
}

interface ExpenditureComponentState
{
    list: TableRow[];
}

export class ExpenditureComponent extends React.Component<ExpenditureComponentProps, ExpenditureComponentState>
{
    constructor(props: ExpenditureComponentProps)
    {
        super(props);

        this.state = {
            list: this._buildList()
        };
    }
    render()
    {
        const { persons, suppliers } = this.props;
        const { list } = this.state;

        return (
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
                            list.map((item, index) => (
                                [
                                    < tr >
                                        <td>
                                            {
                                                item.children.length > 0
                                                    ?
                                                    <a
                                                        className="pull-right btn btn-xs btn-default"
                                                        onClick={() =>
                                                        {
                                                            const { list } = this.state;

                                                            list[index].showChildren = !list[index].showChildren;
                                                            this.setState({ list: list })
                                                        }}
                                                    >
                                                        {
                                                            item.showChildren
                                                                ?
                                                                <i className="glyphicon glyphicon-menu-up" />
                                                                :
                                                                <i className="glyphicon glyphicon-menu-down" />
                                                        }
                                                    </a>
                                                    :
                                                    null
                                            }
                                        </td>
                                        <td>{suppliers.find(s => s.supplierId == item.supplierId)!.name}</td>
                                        <td className="text-right">${item.avgPerVisit.toFixed(2)}</td>
                                        <td className="text-right">${item.avgPerMonth.toFixed(2)}</td>
                                        <td className="text-right">${item.totalSpend.toFixed(2)}</td>
                                    </tr>,
                                    item.showChildren
                                        ?
                                        item.children.map(child =>
                                            (
                                                <tr className="small">
                                                    <td></td>
                                                    <td>{persons.find(s => s.personId == child.personId)!.name}</td>
                                                    <td className="text-right">${child.avgPerVisit.toFixed(2)}</td>
                                                    <td className="text-right">${child.avgPerMonth.toFixed(2)}</td>
                                                    <td className="text-right">${child.totalSpend.toFixed(2)}</td>
                                                </tr>
                                            )
                                        )
                                        :
                                        null
                                ]
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
        );
    }

    private _buildList(): TableRow[]
    {
        const { persons, suppliers, expenditures } = this.props;
        const result: TableRow[] = [];
        const groupedExpenditures = new Queryable(expenditures)
            .groupBy(e => e.supplierId)
            .toArray();


        for (const gExp of groupedExpenditures)
        {
            result.push({
                showChildren: false,
                supplierId: gExp.key,
                avgPerVisit: gExp.groupedRows.sum(e => e.avgPerVisit),
                avgPerMonth: gExp.groupedRows.sum(e => e.avgPerMonth),
                totalSpend: gExp.groupedRows.sum(e => e.totalSpend),
                children: gExp.groupedRows.select(e => ({
                    personId: e.personId,
                    avgPerVisit: e.avgPerVisit,
                    avgPerMonth: e.avgPerMonth,
                    totalSpend: e.totalSpend,
                })).toArray()
            });
        }

        return new Queryable(result).orderByDescending(t => t.totalSpend).toArray();
    }
}