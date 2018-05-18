import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

export class NavMenu extends React.Component<{}, {}> {
    public render()
    {
        return <div className='main-nav'>
            <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'}>Bill Splitter</Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <p className="navbar-text"><span className="text-primary text-uppercase small">Billing</span></p>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink to={'/'} exact activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/billcollections'} activeClassName='active'>
                                <span className='glyphicon glyphicon-list'></span> Bill collections
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/payments'} activeClassName='active'>
                                <span className='glyphicon glyphicon-credit-card'></span> Payments
                            </NavLink>
                        </li>
                    </ul>
                    <hr className="nav-divider" />
                    <p className="navbar-text"><span className="text-primary text-uppercase small">Admin</span></p>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink to={'/suppliers'} activeClassName='active'>
                                <span className='glyphicon glyphicon-shopping-cart'></span> Suppliers
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/persons'} activeClassName='active'>
                                <span className='glyphicon glyphicon-user'></span> People
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>;
    }
}
