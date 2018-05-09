import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BillCollection, Person, Supplier } from '../models/models';
import { BillCollectionEditorComponent } from '../components/BillCollectionEditorComponent';

interface BillCollectionsCreateState
{
    persons: Person[];
    personsLoading: boolean;
    suppliers: Supplier[];
    suppliersLoading: boolean;
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
                    this.state.personsLoading && this.state.suppliersLoading
                        ?
                        <span>Loading...</span>
                        :
                        <BillCollectionEditorComponent
                            billCollection={({
                                billCollectionId: 0,
                                date: new Date(),
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

        window.location.assign('/billcollections');
    }
}
