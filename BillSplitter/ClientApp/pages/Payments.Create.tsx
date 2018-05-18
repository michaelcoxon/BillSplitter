import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Payment, Person } from '../models/models';
import { PaymentEditorComponent } from '../components/PaymentEditorComponent';
import { Strings } from '@michaelcoxon/utilities';


interface PaymentsCreateState
{
    loading: boolean;
    submitError?: string;
    persons: Person[];
}

export class PaymentsCreate extends React.Component<RouteComponentProps<{}>, PaymentsCreateState>
{
    constructor(props: RouteComponentProps<{}>)
    {
        super(props);

        this.state = {
            persons: [],
            loading: true,
        };
    }

    public async componentWillMount()
    {
        const [personsResponse] = await Promise.all([fetch('api/person')]);

        const persons = (await personsResponse.json()) as Person[];

        this.setState({
            persons: persons,
            loading: false,
        });
    }

    public render(): JSX.Element
    {
        return (
            <div>
                <h1>Create payment</h1>
                {
                    !Strings.isNullOrEmpty(this.state.submitError)
                        ?
                        <div className="alert alert-danger">{this.state.submitError}</div>
                        :
                        null
                }
                {
                    !this.state.loading
                        ?
                        <PaymentEditorComponent
                            persons={this.state.persons}
                            payment={({
                                paymentId: 0,
                                date: new Date().toJSON(),
                                amount: 0,
                            })}
                            onSave={async (s) => await this._savePayment(s)}
                        />
                        :
                        <p>loading...</p>
                }
            </div>
        )
    }

    private async _savePayment(payments: Payment)
    {
        const response = await fetch(
            `api/payment`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(payments)
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
