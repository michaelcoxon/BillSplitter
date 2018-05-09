import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Supplier } from '../models/models';
import { SupplierEditorComponent } from '../components/SupplierEditorComponent';


interface SuppliersEditState extends Supplier
{
    loading: boolean;
}

export class SuppliersEdit extends React.Component<RouteComponentProps<{ id: number }>, SuppliersEditState>
{
    constructor(props: RouteComponentProps<{ id: number }>)
    {
        super(props);

        this.state = {
            supplierId: props.match.params.id,
            name: "",
            loading: true
        };
    }

    public async componentWillMount()
    {
        const { supplierId } = this.state;
        const response = await fetch(`api/supplier/${supplierId}`);
        const supplier = (await response.json()) as Supplier;

        this.setState({
            supplierId: supplier.supplierId,
            name: supplier.name,
            loading: false,
        });
    }

    public render(): JSX.Element
    {
        const { supplierId, name, loading } = this.state;

        return (
            <div>
                {
                    loading
                        ?
                        <span>Loading...</span>
                        :
                        <div>
                            <h1>Edit - {name}</h1>
                            <SupplierEditorComponent
                                supplier={{
                                    supplierId: supplierId,
                                    name: name
                                }}
                                onSave={async (s) => await this._saveSupplier(s)}
                            />
                        </div>

                }
            </div>
        )
    }

    private async _saveSupplier(supplier: Supplier)
    {
        const response = await fetch(
            `api/supplier/${supplier.supplierId}`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(supplier)
            });

        window.location.assign('/suppliers');
    }
}
