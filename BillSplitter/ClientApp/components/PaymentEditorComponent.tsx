import * as React from 'react';
import { Payment, Person } from "../models/models";
import { getISODate } from '../utilities';


interface PaymentEditorComponentProps
{
    persons: Person[];
    payment: Payment;
    onSave: (payment: Payment) => void;
}

interface PaymentEditorComponentState extends Payment { }

export class PaymentEditorComponent extends React.Component<PaymentEditorComponentProps, PaymentEditorComponentState>
{
    constructor(props: PaymentEditorComponentProps)
    {
        super(props);

        this.state = {
            paymentId: props.payment.paymentId,
            amount: props.payment.amount,
            date: props.payment.date,
            receiverPersonId: props.payment.receiverPersonId,
            senderPersonId: props.payment.senderPersonId,
        };
    }

    public render(): JSX.Element
    {
        const payment = this.state;

        return (
            <div>
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        placeholder="Date"
                        value={getISODate(new Date(payment.date))}
                        onChange={(ev) => this.setState({ date: new Date(ev.target.value).toJSON() })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Sender</label>
                    {this._renderSenderDropDown()}
                </div>
                <div className="form-group">
                    <label htmlFor="date">Receiver</label>
                    {this._renderReceiverDropDown()}
                </div>
                <div className="form-group">
                    <label htmlFor="date">Amount</label>
                    <input
                        type="number"
                        className="form-control text-right"
                        step={0.01}
                        value={this.state.amount !== undefined ? this.state.amount.toFixed(2) : undefined}
                        onChange={(ev) => this.setState({ amount: parseFloat(ev.target.value) })}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => this._saveClicked()}
                >
                    Save
                    </button>
            </div>
        );
    }

    private _renderSenderDropDown()
    {
        const { persons } = this.props;

        return (
            <select
                className="form-control"
                onChange={(ev) => this.setState({ senderPersonId: parseInt(ev.target.value) })}
                defaultValue={this.state.senderPersonId !== undefined ? this.state.senderPersonId.toString() : ""}
            >
                <option disabled={true} value={""}>Please select</option>
                {persons.map(s => <option key={s.personId} value={s.personId}> {s.name}</option>)}
            </select>
        );
    }

    private _renderReceiverDropDown()
    {
        const { persons } = this.props;

        return (
            <select
                className="form-control"
                onChange={(ev) => this.setState({ receiverPersonId: parseInt(ev.target.value) })}
                defaultValue={this.state.receiverPersonId !== undefined ? this.state.receiverPersonId.toString() : ""}
            >
                <option disabled={true} value={""}>Please select</option>
                {persons.map(s => <option key={s.personId} value={s.personId}> {s.name}</option>)}
            </select>
        );
    }

    private _saveClicked()
    {
        const payment: Payment = {
            amount: this.state.amount,
            date: this.state.date,
            paymentId: this.state.paymentId,
            receiverPersonId: this.state.receiverPersonId,
            senderPersonId: this.state.senderPersonId,
        }

        this.props.onSave(payment);
    }

}