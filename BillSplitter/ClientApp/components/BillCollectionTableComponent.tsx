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
                            <th className="td-shrink">Amount</th>
                            <th className="td-shrink">Actions</th>
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
                                            <td>{new Date(s.date).toDateString()}</td>
                                            <td className="text-right">${s.bills.reduce((p, c) => p + (c.totalAmount || 0), 0).toFixed(2)}</td>
                                            <td>
                                                <a
                                                    onClick={() => this._editBillCollection(s.billCollectionId)}
                                                >
                                                    Edit...
                                            </a>
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
