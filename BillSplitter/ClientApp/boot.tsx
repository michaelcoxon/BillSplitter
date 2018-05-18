import './css/site.css';
import 'bootstrap';
import * as jQuery from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import * as RoutesModule from './routes';
let routes = RoutesModule.routes;

function renderApp()
{
    // This code starts up the React app when it runs in a browser. It sets up the routing
    // configuration and injects the app into a DOM element.
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
    ReactDOM.render(
        <AppContainer>
            <BrowserRouter children={routes} basename={baseUrl} />
        </AppContainer>,
        document.getElementById('react-app')
    );
}

renderApp();

// Allow Hot Module Replacement
if (module.hot)
{
    module.hot.accept('./routes', () =>
    {
        routes = require<typeof RoutesModule>('./routes').routes;
        renderApp();
    });
}

jQuery(($) =>
{
    $('.dropdown.keep-open').on({
        "shown.bs.dropdown": function ()
        {
            (this as any).closable = true;
        },
        "click": function (ev)
        {
            console.log(ev);
            if ($(ev.currentTarget).find('.dropdown-menu').find(ev.target).length > 0)
            {
                (this as any).closable = false;
            }
            else
            {
                (this as any).closable = true;
            }
        },
        "hide.bs.dropdown": function (ev)
        {
            try
            {
                return (this as any).closable;
            }
            finally
            {
                (this as any).closable = true;
            }
        }
    });
});
