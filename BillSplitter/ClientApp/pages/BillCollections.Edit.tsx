import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BillCollection, Supplier, Person } from '../models/models';
import { BillCollectionEditorComponent } from '../components/BillCollectionEditorComponent';
import { Strings } from '@michaelcoxon/utilities';


interface BillCollectionsEditState extends BillCollection
{
    loading: boolean;
    persons: Person[];
    personsLoading: boolean;
    suppliers: Supplier[];
    suppliersLoading: boolean;
    submitError?: string;
}

export class BillCollectionsEdit extends React.Component<RouteComponentProps<{ id: number }>, BillCollectionsEditState>
{
    constructor(props: RouteComponentProps<{ id: number }>)
    {
        super(props);

        this.state = {
            billCollectionId: props.match.params.id,
            bills: [],
            date: new Date().toJSON(),
            loading: true,
            persons: [],
            personsLoading: true,
            suppliers: [],
            suppliersLoading: true,
        };
    }

    public async componentWillMount()
    {
        const { billCollectionId } = this.state;

        const [billCollectionResponse, suppliersResponse, personsResponse] = await Promise.all([fetch(`api/billCollection/${billCollectionId}`), fetch('api/supplier'), fetch('api/person')]);

        const billCollection = (await billCollectionResponse.json()) as BillCollection;
        const suppliers = (await suppliersResponse.json()) as Supplier[];
        const persons = (await personsResponse.json()) as Person[];

        this.setState({
            billCollectionId: billCollection.billCollectionId,
            bills: billCollection.bills,
            date: billCollection.date,
            loading: false,
            persons: persons,
            personsLoading: false,
            suppliers: suppliers,
            suppliersLoading: false,
        });
    }

    public render(): JSX.Element
    {
        const { billCollectionId, bills, date, loading, persons, personsLoading, suppliers, suppliersLoading, submitError } = this.state;

        return (
            <div>
                {
                    loading && personsLoading && suppliersLoading
                        ?
                        <span>Loading...</span>
                        :
                        <div>
                            <h1>Edit - {new Date(date).toDateString()}</h1>
                            {
                                !Strings.isNullOrEmpty(submitError)
                                    ?
                                    <div className="alert alert-danger">{submitError}</div>
                                    :
                                    null
                            }
                            <BillCollectionEditorComponent
                                billCollection={{
                                    billCollectionId: billCollectionId,
                                    bills: bills,
                                    date: date,
                                }}
                                onSave={async (s) => await this._saveBillCollection(s)}
                                persons={persons}
                                suppliers={suppliers}
                            />
                        </div>

                }
            </div>
        )
    }

    private async _saveBillCollection(billCollection: BillCollection)
    {
        const response = await fetch(
            `api/billcollection/${billCollection.billCollectionId}`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(billCollection)
            });

        if (response.ok)
        {
            window.location.assign('/billcollections');
        }
        else
        {
            if (response.body !== null)
            {
                this.setState({ submitError: await response.text() });
            } else
            {
                this.setState({ submitError: response.statusText });
            }
        }
    }
}
