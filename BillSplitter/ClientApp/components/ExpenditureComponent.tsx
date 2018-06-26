import * as React from 'react';
import { Queryable } from '@michaelcoxon/collections'
import { BillCollection, Person, Supplier, Bill, Expenditure } from "../models/models";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import * as Color from 'color';

const goldenRatio = 0.618033988749895;

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
        const gen = this._generateColor(157 / 360, 0.84, 0.58);
        const COLORS = list.map(i => gen.next().value);

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4>Expenditures</h4>
                </div>
                <div className="panel-body">
                    <div className="row">
                        <div className="col-sm-4" style={{ height: "33vh" }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={list.map(i => ({
                                            name: suppliers.find(s => s.supplierId == i.supplierId)!.name,
                                            value: i.avgPerVisit
                                        }))}
                                        nameKey="name"
                                        dataKey="value"
                                        fill="#8884d8"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={3}
                                    >
                                        {
                                            list.map((entry, index) => <Cell
                                                fill={COLORS[index % COLORS.length]}
                                            />)
                                        }

                                    </Pie>
                                    <Tooltip
                                        isAnimationActive={false}
                                        formatter={(v) => <strong>${(v as number).toFixed(2)}</strong>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="col-sm-4" style={{ height: "33vh" }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={list.map(i => ({
                                            name: suppliers.find(s => s.supplierId == i.supplierId)!.name,
                                            value: i.avgPerMonth
                                        }))}
                                        nameKey="name"
                                        dataKey="value"
                                        fill="#8884d8"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={3}
                                    >
                                        {
                                            list.map((entry, index) => <Cell
                                                fill={COLORS[index % COLORS.length]}                                                
                                            />)
                                        }
                                    </Pie>
                                    <Tooltip
                                        isAnimationActive={false}
                                        formatter={(v) => <strong>${(v as number).toFixed(2)}</strong>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="col-sm-4" style={{ height: "33vh" }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={list.map(i => ({
                                            name: suppliers.find(s => s.supplierId == i.supplierId)!.name,
                                            value: i.totalSpend
                                        }))}
                                        nameKey="name"
                                        dataKey="value"
                                        fill="#8884d8"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={3}
                                    >
                                        {
                                            list.map((entry, index) => <Cell
                                                fill={COLORS[index % COLORS.length]}
                                            />)
                                        }
                                    </Pie>
                                    <Tooltip
                                        isAnimationActive={false}
                                        formatter={(v) => <strong>${(v as number).toFixed(2)}</strong>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
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
                    <tfoot>
                        <tr>
                            <th></th>
                            <th>Total</th>
                            <th className="text-right"></th>
                            <th className="text-right">${list.reduce((p, c) => p + c.avgPerMonth, 0).toFixed(2)}</th>
                            <th className="text-right">${list.reduce((p, c) => p + c.totalSpend, 0).toFixed(2)}</th>
                        </tr>
                    </tfoot>
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

    private * _generateColor(hue: number = Math.random(), saturation: number = 0.5, value: number = 0.95): Iterator<string>
    {
        while (true)
        {
            yield new Color({
                h: hue * 360,
                s: saturation * 100,
                l: value * 100
            }).hex();

            hue += goldenRatio;
            hue %= 1;
        }
    }
}