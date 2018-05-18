import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Payment, Person, BillCollection, Split } from '../models/models';

interface HomeState
{
    loading: boolean;
    persons: Person[];
    payments: Payment[];
    billCollections: BillCollection[];
}

type TableRow = { receiverId: number, senderId: number, amount: number };

export class Home extends React.Component<RouteComponentProps<{}>, HomeState> {

    constructor(props: RouteComponentProps<{}>)
    {
        super(props);

        this.state = {
            loading: true,
            persons: [],
            payments: [],
            billCollections: [],
        };
    }

    public async componentWillMount()
    {
        const [paymentResponse, personsResponse, billCollectionResponse] = await Promise.all([fetch('api/payment'), fetch('api/person'), fetch('api/billCollection')]);

        const payments = (await paymentResponse.json()) as Payment[];
        const persons = (await personsResponse.json()) as Person[];
        const billCollections = (await billCollectionResponse.json()) as BillCollection[];

        this.setState({
            loading: false,
            persons: persons,
            payments: payments,
            billCollections: billCollections,
        });
    }

    public render()
    {
        const { loading, persons, payments, billCollections } = this.state;
        let list: TableRow[] = []

        if (!loading)
        {
            list = this._buildList();
        }

        return (
            <div>
                <h1>Dashboard</h1>
                {
                    !loading
                        ?
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4>Outstanding funds</h4>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Receiver</th>
                                        <th>Sender</th>
                                        <th className="td-shrink">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        list.length > 0
                                            ?
                                            list.map(i =>
                                            {
                                                <tr>
                                                    <td>{persons.find(p => p.personId == i.receiverId)!.name}</td>
                                                    <td>{persons.find(p => p.personId == i.senderId)!.name}</td>
                                                    <td className="text-right">${i.amount.toFixed(2)}</td>
                                                </tr>
                                            })
                                            :
                                            <tr>
                                                <td colSpan={3}>No items</td>
                                            </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        :
                        <p>Loading...</p>
                }
            </div>
        );
    }

    private _buildList(): TableRow[]
    {
        // { payeeId: number, payerId: number, amount: number }
        let result: TableRow[] = [];

        for (var receiver of this.state.persons)
        {
            var receivedTotal: number = this.state.payments
                .filter(p => p.receiverPersonId == receiver.personId)
                .reduce((p, c) => p + c.amount, 0);

            var owedTotal: number = this.state.billCollections
                .filter(bc => bc.bills.some(b => b.personId == receiver.personId))
                .reduce((p, c) => c.bills.reduce((p, b) =>
                {
                    let recieverSplit: Split | undefined;

                    if (b.splits !== undefined && (recieverSplit = b.splits.find(s => s.personId == receiver.personId)) !== undefined)
                    {
                        return p + 1;
                    }
                    else
                    {
                        return p + 0;
                    }
                }, 0), 0);

            var actualOwed = owedTotal - receivedTotal;

            if (actualOwed > 0)
            {
                result.push({
                    receiverId: receiver.personId,
                    senderId: receiver.personId,
                    amount: actualOwed
                });
            }
            else if (actualOwed < 0)
            {
                result.push({
                    receiverId: receiver.personId,
                    senderId: receiver.personId,
                    amount: actualOwed
                });
            }
        }

        return result;
    }
}
