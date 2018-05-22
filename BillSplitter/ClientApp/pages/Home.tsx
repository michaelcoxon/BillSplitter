import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Payment, Person, BillCollection, Split, Bill } from '../models/models';
import { BillHelpers } from '../helpers/ModelHelpers';

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
                                        <th>Sender</th>
                                        <th>Receiver</th>
                                        <th className="td-shrink">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        list.length > 0
                                            ?
                                            list.map(i =>
                                                (
                                                    <tr>
                                                        <td>{persons.find(p => p.personId == i.senderId)!.name}</td>
                                                        <td>{persons.find(p => p.personId == i.receiverId)!.name}</td>
                                                        <td className="text-right">${i.amount.toFixed(2)}</td>
                                                    </tr>
                                                )
                                            )
                                            :
                                            (
                                                <tr>
                                                    <td colSpan={3}>No items</td>
                                                </tr>
                                            )
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
        const result: TableRow[] = [];

        for (let receiver of this.state.persons)
        {
            for (let sender of this.state.persons.filter(p => p.personId !== receiver.personId))
            {
                const receivedTotal: number = this.state.payments
                    .filter(p => p.receiverPersonId == receiver.personId && p.senderPersonId == sender.personId)
                    .reduce((p, c) => p + c.amount, 0);

                const owedTotal: number = this.state.billCollections
                    .reduce<Bill[]>((b, bc) => [...b, ...bc.bills], [])
                    .filter(b => b.personId == receiver.personId && b.splits !== undefined && b.splits.some(s => s.personId == sender.personId))
                    .reduce((p, b) =>
                    {
                        const split = b.splits!.find(s => s.personId == sender.personId)!
                        return p + BillHelpers.getSingleSplitAmount(b, split);
                    }, 0);

                const actualOwed = owedTotal - receivedTotal;

                const newItem: TableRow = {
                    receiverId: receiver.personId,
                    senderId: sender.personId,
                    amount: actualOwed
                };

                if (newItem.amount > 0)
                {
                    result.push(newItem);
                }
            }
        }

        // for each person
        for (let person1 of this.state.persons)
        {
            for (let person2 of this.state.persons.filter(p => p.personId !== person1.personId))
            {
                // find where they owe each other
                const person1IsOwedByPerson2_index = result.findIndex(r => r.receiverId == person1.personId && r.senderId == person2.personId);
                const person2IsOwedByPerson1_index = result.findIndex(r => r.receiverId == person2.personId && r.senderId == person1.personId);

                if (person1IsOwedByPerson2_index > -1 && person2IsOwedByPerson1_index > -1)
                {
                    const person1IsOwedByPerson2 = result[person1IsOwedByPerson2_index];
                    const person2IsOwedByPerson1 = result[person2IsOwedByPerson1_index];

                    // if p2 owes p1 more than p1 owes p2
                    if (person1IsOwedByPerson2.amount > person2IsOwedByPerson1.amount)
                    {
                        // subtract p1's debt from what p2 owes them and remove p1's debt
                        person1IsOwedByPerson2.amount = person1IsOwedByPerson2.amount - person2IsOwedByPerson1.amount;
                        result.splice(person2IsOwedByPerson1_index, 1);
                    }
                    // if p1 owes p2 more than p2 owes p1
                    else if (person1IsOwedByPerson2.amount < person2IsOwedByPerson1.amount)
                    {
                        // subtract p2's debt from what p1 owes them and remove p2's debt
                        person2IsOwedByPerson1.amount = person2IsOwedByPerson1.amount - person1IsOwedByPerson2.amount;
                        result.splice(person1IsOwedByPerson2_index, 1);
                    }
                    // if they owe each other the same
                    else
                    {
                        //remove both
                        result.splice(person2IsOwedByPerson1_index, 1);
                        result.splice(person1IsOwedByPerson2_index, 1);
                    }
                }
            }
        }

        return result;
    }
}
