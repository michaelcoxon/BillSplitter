import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Supplier } from '../models/models';
import { SupplierEditorComponent } from '../components/SupplierEditorComponent';


export class SuppliersCreate extends React.Component<RouteComponentProps<{}>, {}>
{
    public render(): JSX.Element
    {
        return (
            <div>
                <h1>Create supplier</h1>
                <SupplierEditorComponent
                    supplier={({
                        supplierId: 0,
                        name: ""
                    })}
                    onSave={async (s) => await this._saveSupplier(s)}
                />
            </div>
        )
    }

    private async _saveSupplier(supplier: Supplier)
    {
        const response = await fetch(
            `api/supplier`,
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
