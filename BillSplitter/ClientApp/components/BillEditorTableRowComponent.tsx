﻿import * as React from 'react';
import { Supplier, Person, Bill, Split } from "../models/models";
import { NotSupportedException, Strings } from '@michaelcoxon/utilities';
import { BillHelpers } from '../helpers/ModelHelpers';
import { getISODate } from '../utilities';


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
    billDate: string;
    totalAmount?: number;
    supplierId?: number
    personId?: number
    splits: Split[];
    comment?: string;
}

export class BillEditorTableRowComponent extends React.Component<BillEditorTableRowComponentProps, BillEditorTableRowComponentState>
{
    constructor(props: BillEditorTableRowComponentProps)
    {
        super(props);

        this.state = {
            billId: props.bill.billId,
            billDate: props.bill.billDate,
            personId: props.bill.personId,
            splits: props.bill.splits !== undefined ? props.bill.splits : [],
            supplierId: props.bill.supplierId,
            totalAmount: props.bill.totalAmount,
            comment: props.bill.comment,
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
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        placeholder="Date"
                        defaultValue={getISODate(new Date(this.state.billDate))}
                        onChange={(ev) =>
                        {
                            this.props.onChange(this.props.index, { billDate: new Date(ev.target.value).toJSON() });
                            this.setState({ billDate: new Date(ev.target.value).toJSON() })
                        }}
                    />
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
                            defaultValue={this.state.totalAmount !== undefined ? this.state.totalAmount.toFixed(2) : undefined}
                            onBlur={(ev) => ev.target.value = (this.state.totalAmount || 0).toFixed(2)}
                            onChange={(ev) =>
                            {
                                const value = parseFloat(ev.target.value);
                                this.props.onChange(this.props.index, { totalAmount: value });
                                this.setState({ totalAmount: value });
                            }}
                        />
                    </div>
                </td>
                <td>
                    {this._renderPaidByDropDown()}
                </td>
                <td>
                    {this._renderSplitWithDropDown()}
                </td>
                <td>
                    <button type="button" className={`btn btn-default ${Strings.isNullOrEmpty(this.state.comment || null) ? '' : 'has-comment'}`} onClick={() => this._setComment()}>
                        <span className="glyphicon glyphicon-comment"></span>
                    </button>
                </td>
            </tr>
        )
    }

    private _setComment(): void
    {
        let { comment } = this.state;
        comment = Strings.trim(prompt("Item comment", comment || undefined) || Strings.empty);

        if (Strings.isNullOrEmpty(comment))
        {
            comment = undefined;
        }

        this.props.onChange(this.props.index, { comment });
        this.setState({ comment });
    }

    private _renderSupplierDropDown()
    {
        const { suppliers } = this.props;

        return (
            <select
                className="form-control"
                onChange={(ev) =>
                {
                    const value = parseInt(ev.target.value);
                    this.props.onChange(this.props.index, { supplierId: value });
                    this.setState({ supplierId: value });
                }}
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
                onChange={(ev) =>
                {
                    const value = parseInt(ev.target.value);
                    this.props.onChange(this.props.index, { personId: value });
                    this.setState({ personId: value });
                }}
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
            this.state.splits.map(s => BillHelpers.getSplitLabelForSplit(persons, s)).join(", ");

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
                                        defaultChecked={this.state.splits.some(pp => pp.personId == p.personId)}
                                        onChange={(ev) =>
                                        {
                                            const { splits } = this.state;

                                            const existingIndex = splits.findIndex(pp => pp.personId == p.personId);
                                            const isAmount = this.state.splits.some(pp => pp.splitAmount !== undefined && pp.splitAmount !== null);

                                            if (existingIndex > -1 && !ev.target.checked)
                                            {
                                                splits.splice(existingIndex, 1);
                                            }
                                            else if (existingIndex == -1 && ev.target.checked)
                                            {
                                                splits.push({
                                                    billId: this.state.billId,
                                                    personId: p.personId,
                                                    splitAmount: isAmount ? (this.state.totalAmount || 0) - this.state.splits.reduce((p, c) => p + (c.splitAmount || 0), 0) : undefined,
                                                })
                                            }
                                            else
                                            {
                                                throw new NotSupportedException("wtf this is not supposed to happen");
                                            }

                                            if (!isAmount)
                                            {
                                                for (let split of splits)
                                                {
                                                    split.splitPercent = (1 / (splits.length)) * 100;
                                                }
                                            }

                                            this.props.onChange(this.props.index, { splits: splits });
                                            this.setState({ splits: splits });
                                        }}
                                    />
                                    <strong>{p.name}</strong>
                                </label>

                                {(() =>
                                {
                                    const split = this.state.splits.find(pp => pp.personId == p.personId);
                                    if (split !== undefined)
                                    {
                                        return true;
                                    }
                                    else
                                    {
                                        return false;
                                    }
                                })()
                                    ? (
                                        <div>
                                            <label className="checkbox-inline" style={{ display: "block" }} title="Split by value">
                                                <input
                                                    type="checkbox"
                                                    value={p.personId}
                                                    checked={this.state.splits.some(pp => pp.personId == p.personId && (pp.splitAmount !== undefined && pp.splitAmount !== null))}
                                                    onChange={(ev) =>
                                                    {
                                                        const value = parseFloat(ev.target.value);
                                                        const { splits } = this.state;

                                                        for (let split of this.state.splits)
                                                        {
                                                            if (ev.target.checked)
                                                            {
                                                                split.splitAmount = 0;
                                                                split.splitPercent = undefined;
                                                            }
                                                            else
                                                            {
                                                                split.splitAmount = undefined;
                                                                split.splitPercent = (1 / splits.length) * 100;
                                                            }
                                                        }

                                                        this.props.onChange(this.props.index, { splits: splits });
                                                        this.setState({ splits: splits });
                                                    }}
                                                />
                                                Split by value
                                        </label>
                                            {(() =>
                                            {
                                                const split = this.state.splits.find(pp => pp.personId == p.personId && (pp.splitAmount !== undefined && pp.splitAmount !== null));
                                                if (split !== undefined)
                                                {
                                                    return true;
                                                }
                                                else
                                                {
                                                    return false;
                                                }
                                            })()
                                                ?
                                                <input
                                                    type="number"
                                                    className="form-control text-right"
                                                    value={
                                                        (() =>
                                                        {
                                                            const split = this.state.splits.find(pp => pp.personId == p.personId);
                                                            if (split !== undefined)
                                                            {
                                                                return (split.splitAmount || 0).toFixed(2);
                                                            }
                                                            else
                                                            {
                                                                return (0).toFixed(2);
                                                            }
                                                        })()
                                                    }
                                                    onChange={(ev) =>
                                                    {
                                                        const value = parseFloat(ev.target.value);
                                                        const { splits } = this.state;

                                                        const split = this.state.splits.find(pp => pp.personId == p.personId);

                                                        if (split !== undefined)
                                                        {
                                                            split.splitAmount = value;
                                                            split.splitPercent = undefined;
                                                        }
                                                        else
                                                        {
                                                            splits.push({
                                                                billId: this.state.billId,
                                                                personId: p.personId,
                                                                splitAmount: value,
                                                                splitPercent: undefined,
                                                            })
                                                        }

                                                        this.props.onChange(this.props.index, { splits: splits });
                                                        this.setState({ splits: splits });
                                                    }}
                                                />
                                                :
                                                null
                                            }
                                        </div>)
                                    :
                                    null
                                }
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
