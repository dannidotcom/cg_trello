import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = (props: any) => {
    const token = localStorage.getItem("token");
    return <>{token ? <Route {...props} /> : <Redirect to="/" />}</>;
};

export default PrivateRoute;