import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../routes.js'

const Header = ({title}) => (
    <header>
        <Link to={routes.home} className="home-link">
            Home
        </Link>
        <h1>{title}</h1>
    </header>
)

export default Header;
