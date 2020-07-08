import React, {Component} from 'react';
//import styled from 'styled-components';



class Navbar extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                    <a href="" className=" nav-link align-items-center text-white">Pokemon
                    </a>
                    <a href="http://snmln.com/" className="nav-link text-white">Sean Malone</a>
                </nav>
            </div>
        );
    }
}

export default Navbar;