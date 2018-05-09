import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BillCollection } from '../models/models';
import { BillCollectionTableComponent } from '../components/BillCollectionTableComponent';


interface BillCollectionsState
{
    billCollections: BillCollection[];
    loading: boolean
}


export class BillCollections extends React.Component<RouteComponentProps<{}>, BillCollectionsState>
{
    constructor(props: RouteComponentProps<{}>)
    {
        super(props);

        this.state = {
            billCollections: [],
            loading: true,
        };
    }

    public async componentWillMount()
    {
        const response = await fetch('api/billCollection');
        const billCollections = (await response.json()) as BillCollection[];

        this.setState({
            billCollections: billCollections,
            loading: false,
        });
    }

    public render(): JSX.Element
    {
        const { billCollections, loading } = this.state;

        return (
            <div>
                <h1>Bill collections</h1>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => this._createBillCollection()}
                    >
                        Create
                    </button>
                </div>
                {
                    loading
                        ?
                        <span>Loading...</span>
                        :
                        <BillCollectionTableComponent
                            billCollections={billCollections}
                            onEdit={(id) => this._editBillCollection(id)}
                        />
                }
            </div>
        )
    }

    private _createBillCollection()
    {
        window.location.assign('billcollections/create');
    }

    private _editBillCollection(id: number)
    {
        window.location.assign(`billcollections/edit/${id}`);
    }
}