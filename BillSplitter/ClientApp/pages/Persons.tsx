import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Person } from '../models/models';
import { PersonTableComponent } from '../components/PersonTableComponent';


interface PersonsState
{
    persons: Person[];
    loading: boolean
}


export class Persons extends React.Component<RouteComponentProps<{}>, PersonsState>
{
    constructor(props: RouteComponentProps<{}>)
    {
        super(props);

        this.state = {
            persons: [],
            loading: true,
        };
    }

    public async componentWillMount()
    {
        const response = await fetch('api/person');
        const persons = (await response.json()) as Person[];

        this.setState({
            persons: persons,
            loading: false,
        });
    }

    public render(): JSX.Element
    {
        const { persons, loading } = this.state;

        return (
            <div>
                <h1>Persons</h1>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => this._createPerson()}
                    >
                        Create
                    </button>
                </div>
                {
                    loading
                        ?
                        <span>Loading...</span>
                        :
                        <PersonTableComponent
                            persons={persons}
                            onEdit={(id) => this._editPerson(id)}
                        />
                }
            </div>
        )
    }

    private _createPerson()
    {
        window.location.assign('persons/create');
    }

    private _editPerson(id: number)
    {
        window.location.assign(`persons/edit/${id}`);
    }
}