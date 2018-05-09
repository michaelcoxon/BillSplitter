import * as React from "react";

import { BillCollection } from "../models/models";

interface BillCollectionEditorComponentProps
{
    billCollections: BillCollection[];

    onEdit: (billCollectionId: number) => void;
}

export class BillCollectionTableComponent extends React.Component<BillCollectionEditorComponentProps>
{
    public render(): JSX.Element
    {
        const { billCollections } = this.props;

        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            billCollections.length > 0
                                ?
                                billCollections.map(s =>
                                {
                                    return (
                                        <tr key={s.billCollectionId}>
                                            <td>{s.date.toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-link btn-sm"
                                                    onClick={() => this._editBillCollection(s.billCollectionId)}
                                                >
                                                    Edit...
                                            </button>
                                            </td>
                                        </tr>
                                    );
                                })
                                :
                                <tr>
                                    <td colSpan={2}>No bill collections</td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        );
    }

    private _editBillCollection(billCollectionId: number): void
    {
        this.props.onEdit(billCollectionId);
    }
}
