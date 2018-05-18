import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Payment, Person } from '../models/models';
import { PaymentTableComponent } from '../components/PaymentTableComponent';


interface PaymentsState
{
    persons: Person[];
    payments: Payment[];
    loading: boolean
}


export class Payments extends React.Component<RouteComponentProps<{}>, PaymentsState>
{
    constructor(props: RouteComponentProps<{}>)
    {
        super(props);

        this.state = {
            persons: [],
            payments: [],
            loading: true,
        };
    }

    public async componentWillMount()
    {
        const [paymentsResponse, personsResponse] = await Promise.all([fetch('api/payment'), fetch('api/person')]);

        const payments = (await paymentsResponse.json()) as Payment[];
        const persons = (await personsResponse.json()) as Person[];

        this.setState({
            persons: persons,
            payments: payments,
            loading: false,
        });
    }

    public render(): JSX.Element
    {
        const { payments, loading, persons } = this.state;

        return (
            <div>
                <h1>Payments</h1>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => this._createPayment()}
                    >
                        Create
                    </button>
                </div>
                {
                    loading
                        ?
                        <span>Loading...</span>
                        :
                        <PaymentTableComponent
                            payments={payments}
                            persons={persons}
                            onEdit={(id) => this._editPayment(id)}
                        />
                }
            </div>
        )
    }

    private _createPayment()
    {
        window.location.assign('payments/create');
    }

    private _editPayment(id: number)
    {
        window.location.assign(`payments/edit/${id}`);
    }
}