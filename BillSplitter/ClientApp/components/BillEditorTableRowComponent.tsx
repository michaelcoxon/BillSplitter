import * as React from 'react';
import { Supplier, Person, Bill, Split } from "../models/models";
import { NotSupportedException } from '@michaelcoxon/utilities';


interface BillEditorTableRowComponentProps
{
    bill: Bill;
    index: number;
    onChange: (index: number, bill: Partial<Bill>) => void;
    onRemove: (index: number) => void;
    suppliers: Supplier[];
    persons: Person[];
}

interface BillEditorTableRowComponentState
{
    billId: number;
    totalAmount?: number;
    supplierId?: number
    personId?: number
    splits: Split[];
}

export class BillEditorTableRowComponent extends React.Component<BillEditorTableRowComponentProps, BillEditorTableRowComponentState>
{
    constructor(props: BillEditorTableRowComponentProps)
    {
        super(props);

        this.state = {
            billId: props.bill.billId,
            personId: props.bill.personId,
            splits: props.bill.splits !== undefined ? props.bill.splits : [],
            supplierId: props.bill.supplierId,
            totalAmount: props.bill.totalAmount,
        };
    }

    public render(): JSX.Element
    {
        return (
            <tr>
                <td>
                    <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => this._onRemoveClick()}
                    >
                        &times;
                    </button>
                </td>
                <td>
                    {this._renderSupplierDropDown()}
                </td>
                <td>
                    <div className="input-group">
                        <span className="input-group-addon">$</span>
                        <input
                            type="number"
                            className="form-control text-right"
                            step={0.01}
                            value={this.state.totalAmount !== undefined ? this.state.totalAmount.toFixed(2) : undefined}
                            onChange={(ev) => this.props.onChange(this.props.index, { totalAmount: parseFloat(ev.target.value) })}
                        />
                    </div>
                </td>
                <td>
                    {this._renderPaidByDropDown()}
                </td>
                <td>
                    {this._renderSplitWithDropDown()}
                </td>
            </tr>
        )
    }

    private _renderSupplierDropDown()
    {
        const { suppliers } = this.props;

        return (
            <select
                className="form-control"
                onChange={(ev) => this.props.onChange(this.props.index, { supplierId: parseInt(ev.target.value) })}
                defaultValue={this.state.supplierId !== undefined ? this.state.supplierId.toString() : ""}
            >
                <option disabled={true} value={""}>Please select</option>
                {suppliers.map(s => <option key={s.supplierId} value={s.supplierId}> {s.name}</option>)}
            </select>
        );
    }

    private _renderPaidByDropDown()
    {
        const { persons } = this.props;

        return (
            <select
                className="form-control"
                onChange={(ev) => this.props.onChange(this.props.index, { personId: parseInt(ev.target.value) })}
                defaultValue={this.state.personId !== undefined ? this.state.personId.toString() : ""}
            >
                <option disabled={true} value={""}>Please select</option>
                {persons.map(s => <option key={s.personId} value={s.personId}> {s.name}</option>)}
            </select>
        );
    }

    private _renderSplitWithDropDown()
    {
        const { persons } = this.props;
        const label = this.state.splits.length == 0
            ?
            "None selected"
            :
            this.state.splits.map(s => persons.find(p => p.personId == s.personId)!.name).join(", ");

        return (
            <div className="dropdown keep-open">
                <button type="button" className="dropdown-toggle btn btn-default" data-toggle="dropdown" title={label} aria-expanded="false">
                    <span>{label}</span>
                    &nbsp;
                    <b className="caret"></b>
                </button>
                <ul className="dropdown-menu dropdown-menu-right">
                    {persons.map(p => (
                        <li key={p.personId}>
                            <a>
                                <label className="checkbox-inline" style={{ display: "block" }} title={p.name}>
                                    <input
                                        type="checkbox"
                                        value={p.personId}
                                        checked={this.state.splits.some(pp => pp.personId == p.personId)}
                                        onChange={(ev) =>
                                        {
                                            const { splits } = this.state;

                                            var existingIndex = splits.findIndex(pp => pp.personId == p.personId);
                                            if (existingIndex > -1 && !ev.target.checked)
                                            {
                                                splits.splice(existingIndex, 1);
                                            }
                                            else if (existingIndex == -1 && ev.target.checked)
                                            {
                                                splits.push({
                                                    billId: this.state.billId,
                                                    personId: p.personId,
                                                })
                                            }
                                            else
                                            {
                                                throw new NotSupportedException("wtf this is not supposed to happen");
                                            }

                                            this.props.onChange(this.props.index, { splits: splits });
                                        }}
                                    />
                                    {p.name}
                                </label>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    private _onRemoveClick()
    {
        this.props.onRemove(this.props.index);
    }
}
