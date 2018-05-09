import * as React from 'react';
import { Supplier, Person, Bill, Split } from "../models/models";


interface BillEditorTableRowComponentProps
{
    bill: Bill;
    onChange: (bill: Bill) => void;
    suppliers: Supplier[];
    persons: Person[];
}

interface BillEditorTableRowComponentState extends Bill { }


export class BillEditorTableRowComponent extends React.Component<BillEditorTableRowComponentProps, BillEditorTableRowComponentState>
{
    constructor(props: BillEditorTableRowComponentProps)
    {
        super(props);

        this.state = {
            billId: props.bill.billId,
            totalAmount: props.bill.totalAmount,
            supplier: props.bill.supplier,
            paidBy: props.bill.paidBy,
            splitWith: props.bill.splitWith
        }
    }

    public render(): JSX.Element
    {
        const { billId, totalAmount, supplier, paidBy, splitWith } = this.state;

        return (
            <tr>
                <td>
                    {this._renderSupplierDropDown(supplier)}
                </td>
                <td>
                    <input
                        type="number"
                        className="form-control"
                        step={0.01}
                        value={totalAmount !== undefined ? totalAmount : undefined}
                        onChange={ev => this.setState({ totalAmount: parseFloat(ev.target.value) }, () => this.props.onChange(this.state))}
                    />
                </td>
                <td>
                    {this._renderPaidByDropDown(paidBy)}
                </td>
                <td>
                    {this._renderSplitWithDropDown(splitWith)}
                </td>
            </tr>
        )
    }

    private _renderSupplierDropDown(selected?: Supplier)
    {
        const { suppliers } = this.props;
        const { supplier } = this.state;

        return (
            <select
                className="form-control"
                onChange={(ev) => this.setState({ supplier: suppliers.find(s => s.supplierId == parseInt(ev.target.value))! }, () => this.props.onChange(this.state))}
                defaultValue={selected !== undefined ? selected.supplierId.toString() : ""}
            >
                <option disabled={true} value={""}>Please select</option>
                {suppliers.map(s => <option key={s.supplierId} value={s.supplierId}> {s.name}</option>)
                }
            </select>
        );
    }

    private _renderPaidByDropDown(selected?: Person)
    {
        const { persons } = this.props;
        const { paidBy } = this.state;

        return (
            <select
                className="form-control"
                onChange={(ev) => this.setState({ paidBy: persons.find(s => s.personId == parseInt(ev.target.value))! }, () => this.props.onChange(this.state))}
                defaultValue={selected !== undefined ? selected.personId.toString() : ""}
            >
                <option disabled={true} value={""}>Please select</option>
                {persons.map(s => <option key={s.personId} value={s.personId}> {s.name}</option>)}
            </select>
        );
    }

    private _renderSplitWithDropDown(selected?: Split[])
    {
        const { persons } = this.props;
        const { splitWith } = this.state;

        return (
            <div>
            </div>
        );
    }
}
