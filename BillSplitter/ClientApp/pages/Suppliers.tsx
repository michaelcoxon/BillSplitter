import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Supplier } from '../models/models';
import { SupplierTableComponent } from '../components/SupplierTableComponent';


interface SuppliersState
{
    suppliers: Supplier[];
    loading: boolean
}


export class Suppliers extends React.Component<RouteComponentProps<{}>, SuppliersState>
{
    constructor(props: RouteComponentProps<{}>)
    {
        super(props);

        this.state = {
            suppliers: [],
            loading: true,
        };
    }

    public async componentWillMount()
    {
        const response = await fetch('api/supplier');
        const suppliers = (await response.json()) as Supplier[];

        this.setState({
            suppliers: suppliers,
            loading: false,
        });
    }

    public render(): JSX.Element
    {
        const { suppliers, loading } = this.state;

        return (
            <div>
                <h1>Suppliers</h1>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => this._createSupplier()}
                    >
                        Create
                    </button>
                </div>
                {
                    loading
                        ?
                        <span>Loading...</span>
                        :
                        <SupplierTableComponent
                            suppliers={suppliers}
                            onEdit={(id) => this._editSupplier(id)}
                        />
                }
            </div>
        )
    }

    private _createSupplier()
    {
        window.location.assign('suppliers/create');
    }

    private _editSupplier(id: number)
    {
        window.location.assign(`suppliers/edit/${id}`);
    }
}