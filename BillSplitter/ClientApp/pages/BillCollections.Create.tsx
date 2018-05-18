import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BillCollection, Person, Supplier } from '../models/models';
import { BillCollectionEditorComponent } from '../components/BillCollectionEditorComponent';
import { Strings } from '@michaelcoxon/utilities';

interface BillCollectionsCreateState
{
    persons: Person[];
    personsLoading: boolean;
    suppliers: Supplier[];
    suppliersLoading: boolean;
    submitError?: string;
}


export class BillCollectionsCreate extends React.Component<RouteComponentProps<{}>, BillCollectionsCreateState>
{
    constructor(props: RouteComponentProps<{}>)
    {
        super(props);

        this.state = {
            persons: [],
            personsLoading: true,
            suppliers: [],
            suppliersLoading: true,
        };
    }

    public async componentWillMount()
    {
        const [suppliersResponse, personsResponse] = await Promise.all([fetch('api/supplier'), fetch('api/person')]);

        const suppliers = (await suppliersResponse.json()) as Supplier[];
        const persons = (await personsResponse.json()) as Person[];

        this.setState({
            persons: persons,
            personsLoading: false,
            suppliers: suppliers,
            suppliersLoading: false,
        });
    }

    public render(): JSX.Element
    {
        return (
            <div>
                <h1>Create bill collection</h1>
                {
                    !Strings.isNullOrEmpty(this.state.submitError)
                        ?
                        <div className="alert alert-danger">{this.state.submitError}</div>
                        :
                        null
                }
                {
                    this.state.personsLoading && this.state.suppliersLoading
                        ?
                        <span>Loading...</span>
                        :
                        <BillCollectionEditorComponent
                            billCollection={({
                                billCollectionId: 0,
                                date: new Date().toJSON(),
                                bills: [],
                            })}
                            onSave={async (s) => await this._saveBillCollection(s)}
                            suppliers={this.state.suppliers}
                            persons={this.state.persons}
                        />
                }
            </div>
        )
    }

    private async _saveBillCollection(billCollection: BillCollection)
    {
        const response = await fetch(
            `api/billcollection`,
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
            }
            else
            {
                this.setState({ submitError: response.statusText });
            }
        }
    }
}
