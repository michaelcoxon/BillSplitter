import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Payment, Person } from '../models/models';
import { PaymentEditorComponent } from '../components/PaymentEditorComponent';
import { Strings } from '@michaelcoxon/utilities';


interface PaymentsEditState extends Payment
{
    loading: boolean;
    submitError?: string;
    persons: Person[];
}

export class PaymentsEdit extends React.Component<RouteComponentProps<{ id: number }>, PaymentsEditState>
{
    constructor(props: RouteComponentProps<{ id: number }>)
    {
        super(props);

        this.state = {
            paymentId: props.match.params.id,
            date: new Date().toDateString(),
            amount: 0,
            persons: [],
            loading: true
        };
    }

    public async componentWillMount()
    {
        const { paymentId } = this.state;
        const [paymentResponse, personsResponse] = await Promise.all([fetch(`api/payment/${paymentId}`), fetch('api/person')]);

        const payment = (await paymentResponse.json()) as Payment;
        const persons = (await personsResponse.json()) as Person[];

        this.setState({
            persons: persons,
            paymentId: payment.paymentId,
            amount: payment.amount,
            date: payment.date,
            receiverPersonId: payment.receiverPersonId,
            senderPersonId: payment.senderPersonId,
            loading: false,
        });
    }

    public render(): JSX.Element
    {
        const { paymentId, amount, date, receiverPersonId, senderPersonId, submitError, persons, loading } = this.state;

        return (
            <div>
                {
                    loading
                        ?
                        <span>Loading...</span>
                        :
                        <div>
                            <h1>Edit - {new Date(date).toDateString()}</h1>
                            {
                                !Strings.isNullOrEmpty(this.state.submitError)
                                    ?
                                    <div className="alert alert-danger">{this.state.submitError}</div>
                                    :
                                    null
                            }
                            <PaymentEditorComponent
                                persons={persons}
                                payment={{
                                    paymentId: paymentId,
                                    amount: amount,
                                    date: date,
                                    receiverPersonId: receiverPersonId,
                                    senderPersonId: senderPersonId
                                }}
                                onSave={async (s) => await this._savePayment(s)}
                            />
                        </div>

                }
            </div>
        )
    }

    private async _savePayment(payment: Payment)
    {
        const response = await fetch(
            `api/payment/${payment.paymentId}`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(payment)
            });

        if (response.ok)
        {
            window.location.assign('/payments');
        }
        else
        {
            this.setState({ submitError: response.statusText });
        }
    }
}
