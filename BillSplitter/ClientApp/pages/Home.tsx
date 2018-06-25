import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Payment, Person, BillCollection, Split, Bill, Supplier } from '../models/models';
import { BillHelpers } from '../helpers/ModelHelpers';
import { OutstandingFundsComponent } from '../components/OutstandingFundsComponent';
import { ExpenditureComponent } from '../components/ExpenditureComponent';

interface HomeState
{
    loading: boolean;
    persons: Person[];
    payments: Payment[];
    suppliers: Supplier[];
    billCollections: BillCollection[];
}

export class Home extends React.Component<RouteComponentProps<{}>, HomeState> {

    constructor(props: RouteComponentProps<{}>)
    {
        super(props);

        this.state = {
            loading: true,
            persons: [],
            payments: [],
            billCollections: [],
            suppliers: []
        };
    }

    public async componentWillMount()
    {
        const [
            paymentResponse,
            personsResponse,
            billCollectionResponse,
            supplierResponse
        ] = await Promise.all([
            fetch('api/payment'),
            fetch('api/person'),
            fetch('api/billCollection'),
            fetch('api/supplier')
        ]);

        const payments = (await paymentResponse.json()) as Payment[];
        const persons = (await personsResponse.json()) as Person[];
        const billCollections = (await billCollectionResponse.json()) as BillCollection[];
        const suppliers = (await supplierResponse.json()) as Supplier[];

        this.setState({
            loading: false,
            persons: persons,
            payments: payments,
            billCollections: billCollections,
            suppliers: suppliers
        });
    }

    public render()
    {
        const { loading, persons, payments, billCollections, suppliers } = this.state;

        return (
            <div>
                <h1>Dashboard</h1>
                {
                    !loading
                        ?
                        <div>
                            <OutstandingFundsComponent
                                billCollections={billCollections}
                                payments={payments}
                                persons={persons}
                            />
                            <ExpenditureComponent
                                billCollections={billCollections}
                                persons={persons}
                                suppliers={suppliers}
                            />
                        </div>
                        :
                        <p>Loading...</p>
                }
            </div>
        );
    }
}
