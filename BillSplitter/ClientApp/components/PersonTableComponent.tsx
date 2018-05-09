import * as React from "react";

import { Person } from "../models/models";

interface PersonEditorComponentProps
{
    persons: Person[];

    onEdit: (personId: number) => void;
}

export class PersonTableComponent extends React.Component<PersonEditorComponentProps>
{
    public render(): JSX.Element
    {
        const { persons } = this.props;

        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            persons.length > 0
                                ?
                                persons.map(s =>
                                {
                                    return (
                                        <tr key={s.personId}>
                                            <td>{s.name}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-link btn-sm"
                                                    onClick={() => this._editPerson(s.personId)}
                                                >
                                                    Edit...
                                            </button>
                                            </td>
                                        </tr>
                                    );
                                })
                                :
                                <tr>
                                    <td colSpan={2}>No people</td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        );
    }

    private _editPerson(personId: number): void
    {
        this.props.onEdit(personId);
    }
}
