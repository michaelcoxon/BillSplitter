import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './pages/shared/Layout';
import { Home } from './pages/Home';
import { Suppliers } from './pages/Suppliers';
import { SuppliersEdit } from './pages/Suppliers.Edit';
import { SuppliersCreate } from './pages/Suppliers.Create';
import { PersonsEdit } from './pages/Persons.Edit';
import { PersonsCreate } from './pages/Persons.Create';
import { Persons } from './pages/Persons';
import { BillCollections } from './pages/BillCollections';
import { BillCollectionsCreate } from './pages/BillCollections.Create';
import { BillCollectionsEdit } from './pages/BillCollections.Edit';

export const routes = <Layout>
    <Route exact path='/' component={Home} />

    <Route exact path='/suppliers' component={Suppliers} />
    <Route exact path='/suppliers/create' component={SuppliersCreate} />
    <Route exact path='/suppliers/edit/:id' component={SuppliersEdit} />

    <Route exact path='/persons' component={Persons} />
    <Route exact path='/persons/create' component={PersonsCreate} />
    <Route exact path='/persons/edit/:id' component={PersonsEdit} />

    <Route exact path='/billcollections' component={BillCollections} />
    <Route exact path='/billcollections/create' component={BillCollectionsCreate} />
    <Route exact path='/billcollections/edit/:id' component={BillCollectionsEdit} />

</Layout>;
