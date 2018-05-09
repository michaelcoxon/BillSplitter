import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Person } from '../models/models';
import { PersonEditorComponent } from '../components/PersonEditorComponent';


export class PersonsCreate extends React.Component<RouteComponentProps<{}>, {}>
{
    public render(): JSX.Element
    {
        return (
            <div>
                <h1>Create person</h1>
                <PersonEditorComponent
                    person={({
                        personId: 0,
                        name: ""
                    })}
                    onSave={async (s) => await this._savePerson(s)}
                />
            </div>
        )
    }

    private async _savePerson(persons: Person)
    {
        const response = await fetch(
            `api/person`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(persons)
            });

        window.location.assign('/persons');
    }
}
