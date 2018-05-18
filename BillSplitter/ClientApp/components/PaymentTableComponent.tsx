import * as React from "react";

import { Payment, Person } from "../models/models";

interface PaymentEditorComponentProps
{
    persons: Person[];
    payments: Payment[];

    onEdit: (paymentId: number) => void;
}

export class PaymentTableComponent extends React.Component<PaymentEditorComponentProps>
{
    public render(): JSX.Element
    {
        const { payments, persons } = this.props;

        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th className="td-shrink">Amount</th>
                            <th className="td-shrink">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            payments.length > 0
                                ?
                                payments.map(s =>
                                {
                                    return (
                                        <tr key={s.paymentId}>
                                            <td>{new Date(s.date).toDateString()}</td>
                                            <td>{persons.find(p => p.personId == s.senderPersonId)!.name}</td>
                                            <td>{persons.find(p => p.personId == s.receiverPersonId)!.name}</td>
                                            <td className="text-right">${s.amount.toFixed(2)}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-link btn-sm"
                                                    onClick={() => this._editPayment(s.paymentId)}
                                                >
                                                    Edit...
                                            </button>
                                            </td>
                                        </tr>
                                    );
                                })
                                :
                                <tr>
                                    <td colSpan={2}>No payments</td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        );
    }

    private _editPayment(paymentId: number): void
    {
        this.props.onEdit(paymentId);
    }
}
