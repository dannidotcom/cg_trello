
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ForgotPassword from "./Auth/ForgotPassword";
import Login from "./Auth/Login";
import Message from "./Auth/Message";
import NewPassword from "./Auth/NewPassword";
import PrivateRoute from "./Auth/PrivateRoute";
import SideBar from "./Components/Layout/SideBar";
import ListProjet from "./Components/Layout/ListProjet";
import Inscription from "./Components/Layout/Inscription";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ Login } />
        <PrivateRoute exact path="/home" component={ SideBar } />
        <Route exact path="/register" component={ Inscription } />
        <Route exact path="/forgot_password" component={ ForgotPassword } />
        <Route exact path="/new_password/:token" component={ NewPassword } />
        <Route exact path="/message" component={ Message } />
        <PrivateRoute exact path="/list_projects" component={ ListProjet } />
      </Switch>
    </BrowserRouter>
  );
}
export default App; 
