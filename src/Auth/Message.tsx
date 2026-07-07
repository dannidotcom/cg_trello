import React from "react";
import Typed from "react-typed";
import './Style.css'

const Message = (): JSX.Element => {
    const text = [
        `Veuillez consulter votre boîte e-mail`
    ];
    return (
        <div className="intro">
            <div style={{ fontSize: "60px", fontFamily: "Roboto Mono", color: "white" }}>
                <Typed strings={text} typeSpeed={60}  />         
            </div>   
            <p style={{ fontSize: "35px", fontFamily: "Roboto Mono", textAlign: "center" }}>Si un compte correspondant à votre adresse e-mail existe, 
                    un e-mail vient d'être envoyé contenant un lien <br />que vous
                     pouvez utiliser pour réinitialiser votre mot de passe. </p>   
        </div>
    );
}

export default Message