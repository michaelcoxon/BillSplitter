import * as React from 'react';
import { Person } from "../models/models";


interface PersonEditorComponentProps
{
    person: Person;
    onSave: (person: Person) => void;
}

interface PersonEditorComponentState extends Person { }

export class PersonEditorComponent extends React.Component<PersonEditorComponentProps, PersonEditorComponentState>
{
    constructor(props: PersonEditorComponentProps)
    {
        super(props);

        this.state = {
            personId: props.person.personId,
            name: props.person.name
        };
    }

    public render(): JSX.Element
    {
        const person = this.state;

        return (
            <div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Name"
                        value={person.name}
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
        const person: Person = {
            personId: this.state.personId,
            name: this.state.name,
        }

        this.props.onSave(person);
    }
}