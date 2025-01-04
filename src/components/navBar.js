import React from "react";
import { Link } from 'react-router-dom';
import './navbar.css'
import ant from "./images/ant.png";
 
function NavBar(){
    return(
        <nav className="navbar">
            <div className="container_navbar">
                <img src={ant} alt= "Antaranga" height={40}/>
                <ul className="navbarList">
                    <li className="navItem"> <Link to="/home">Home</Link> </li>
                    <li className="navItem"> <Link to="/article">Article</Link> </li>
                    <li className="navItem"> <Link to="/quote">Quote</Link> </li>
                    <li className="navItem"> <Link to="/">Logout</Link> </li>
                </ul>
            </div>
        </nav>
    );
}
export default NavBar;