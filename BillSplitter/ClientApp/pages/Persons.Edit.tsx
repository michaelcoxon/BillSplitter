import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Person } from '../models/models';
import { PersonEditorComponent } from '../components/PersonEditorComponent';


interface PersonsEditState extends Person
{
    loading: boolean;
}

export class PersonsEdit extends React.Component<RouteComponentProps<{ id: number }>, PersonsEditState>
{
    constructor(props: RouteComponentProps<{ id: number }>)
    {
        super(props);

        this.state = {
            personId: props.match.params.id,
            name: "",
            loading: true
        };
    }

    public async componentWillMount()
    {
        const { personId } = this.state;
        const response = await fetch(`api/person/${personId}`);
        const person = (await response.json()) as Person;

        this.setState({
            personId: person.personId,
            name: person.name,
            loading: false,
        });
    }

    public render(): JSX.Element
    {
        const { personId, name, loading } = this.state;

        return (
            <div>
                {
                    loading
                        ?
                        <span>Loading...</span>
                        :
                        <div>
                            <h1>Edit - {name}</h1>
                            <PersonEditorComponent
                                person={{
                                    personId: personId,
                                    name: name
                                }}
                                onSave={async (s) => await this._savePerson(s)}
                            />
                        </div>

                }
            </div>
        )
    }

    private async _savePerson(person: Person)
    {
        const response = await fetch(
            `api/person/${person.personId}`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(person)
            });

        window.location.assign('/persons');
    }
}
