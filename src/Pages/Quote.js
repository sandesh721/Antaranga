import React from "react";
import "./quote.css"
import NavBar from "../components/navBar";
function Quote({ bg }){
    return(
        <div className="container_quote" style={{ backgroundColor: bg }}>
            <NavBar />
            <h1>Quote</h1>
        </div>
    );
}
export default Quote;