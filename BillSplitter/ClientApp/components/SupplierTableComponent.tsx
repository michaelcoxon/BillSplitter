import * as React from "react";

import { Supplier } from "../models/models";

interface SupplierEditorComponentProps
{
    suppliers: Supplier[];

    onEdit: (supplierId: number) => void;
}

export class SupplierTableComponent extends React.Component<SupplierEditorComponentProps>
{
    public render(): JSX.Element
    {
        const { suppliers } = this.props;

        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="td-shrink">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            suppliers.length > 0
                                ?
                                suppliers.map(s =>
                                {
                                    return (
                                        <tr key={s.supplierId}>
                                            <td>{s.name}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-link btn-sm"
                                                    onClick={() => this._editSupplier(s.supplierId)}
                                                >
                                                    Edit...
                                            </button>
                                            </td>
                                        </tr>
                                    );
                                })
                                :
                                <tr>
                                    <td colSpan={2}>No suppliers</td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        );
    }

    private _editSupplier(supplierId: number): void
    {
        this.props.onEdit(supplierId);
    }
}
