import * as React from 'react';
import { BillCollection, Supplier, Person, Bill } from "../models/models";
import { BillEditorTableRowComponent } from './BillEditorTableRowComponent';
import { Guid } from '@michaelcoxon/utilities';
import { BillCollectionHelpers, BillHelpers } from '../helpers/ModelHelpers';

interface BillCollectionEditorComponentProps
{
    billCollection: BillCollection;
    onSave: (billCollection: BillCollection) => void;
    suppliers: Supplier[];
    persons: Person[];
}

interface BillCollectionEditorComponentState
{
    billCollectionId: number;
    date: string;
    bills: ItemWithKey<Bill>[];
}

class ItemWithKey<T>
{
    readonly key: string;
    item: T;

    constructor(item: T)
    {
        this.item = item;
        this.key = Guid.newGuid().toString();
    }
}

export class BillCollectionEditorComponent extends React.Component<BillCollectionEditorComponentProps, BillCollectionEditorComponentState>
{
    constructor(props: BillCollectionEditorComponentProps)
    {
        super(props);

        this.state = {
            billCollectionId: props.billCollection.billCollectionId,
            date: props.billCollection.date,
            bills: props.billCollection.bills.map(b => new ItemWithKey(b)),
        };
    }

    public render(): JSX.Element
    {
        const billCollection = this.state;

        return (
            <div>
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        placeholder="Date"
                        value={this._getISODate(new Date(billCollection.date))}
                        onChange={(ev) => this.setState({ date: new Date(ev.target.value).toJSON() })}
                    />
                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => this._addBill()}
                    >
                        Add bill
                    </button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>&nbsp;</th>
                                <th>Supplier</th>
                                <th>Total amount</th>
                                <th>Paid by</th>
                                <th>Split with</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                billCollection.bills.length > 0
                                    ?
                                    billCollection.bills.map((bill, index) => <BillEditorTableRowComponent
                                        key={bill.key}
                                        index={index}
                                        bill={bill.item}
                                        persons={this.props.persons}
                                        suppliers={this.props.suppliers}
                                        onChange={(i, b) =>
                                        {
                                            const { bills } = this.state;
                                            bills[i].item = Object.assign(bills[i].item, b);
                                            this.setState({ bills: bills })
                                        }}
                                        onRemove={index =>
                                        {
                                            const { bills } = this.state;
                                            bills.splice(index, 1);
                                            this.setState({ bills: bills });
                                        }}
                                    />)
                                    :
                                    <tr>
                                        <td colSpan={4}>No bills</td>
                                    </tr>
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Total</td>
                                <th>&nbsp;</th>
                                <td className="text-right">{`$${BillHelpers.computeTotal(...billCollection.bills.map(ib=>ib.item)).toFixed(2)}`}</td>
                                <td>&nbsp;</td>
                                <td className="text-right">
                                    {(() =>
                                    {
                                        const total = BillHelpers.computeTotal(...billCollection.bills.map(ib => ib.item));
                                        let splitAmount = BillHelpers.getSplitAmount(total, billCollection.bills.map(ib => ib.item));


                                        return total - splitAmount == 0
                                            ?
                                            <span className="text-success">{`$${splitAmount.toFixed(2)}`}</span>
                                            :
                                            <span>
                                                <span className="text-danger">{`$${splitAmount.toFixed(2)}`}</span>
                                                &nbsp;
                                                <small className="text-muted">({`$${(total - splitAmount).toFixed(2)}`})</small>
                                            </span>
                                    })()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
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

    private _addBill()
    {
        const { bills, billCollectionId } = this.state;

        bills.push(new ItemWithKey({
            billId: 0,
            billCollectionId: billCollectionId
        }));

        this.setState({
            bills: bills
        });
    }

    private _saveClicked()
    {
        const billCollection: BillCollection = {
            billCollectionId: this.state.billCollectionId,
            date: this.state.date,
            bills: this.state.bills.map(b => b.item)
        }

        this.props.onSave(billCollection);
    }

    private _getISODate(date: Date)
    {
        return `${this._leftPad('0', date.getFullYear(), 4)}-${this._leftPad('0', date.getMonth() + 1, 2)}-${this._leftPad('0', date.getDate(), 2)}`;
    }

    private _leftPad(str: string, value: number, length: number)
    {
        let strValue = value.toString();
        while (strValue.length < length)
        {
            strValue = str + strValue;
        }
        return strValue;
    }
}