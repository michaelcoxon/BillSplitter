import * as React from 'react';
import { Supplier } from "../models/models";


interface SupplierEditorComponentProps
{
    supplier: Supplier;
    onSave: (supplier: Supplier) => void;
}

interface SupplierEditorComponentState extends Supplier { }

export class SupplierEditorComponent extends React.Component<SupplierEditorComponentProps, SupplierEditorComponentState>
{
    constructor(props: SupplierEditorComponentProps)
    {
        super(props);

        this.state = {
            supplierId: props.supplier.supplierId,
            name: props.supplier.name
        };
    }

    public render(): JSX.Element
    {
        const supplier = this.state;

        return (
            <div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Name"
                        value={supplier.name}
                        onChange={(ev) => this.setState({ name: ev.target.value })}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => this._saveClicked()}
                >
                    Save
                    </button>
            </div>
        );
    }

    private _saveClicked()
    {
        const supplier: Supplier = {
            supplierId: this.state.supplierId,
            name: this.state.name,
        }

        this.props.onSave(supplier);
    }
}