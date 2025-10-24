import './App.css';
import {Fragment} from "react";
import {BrowserRouter as Router, useRoutes} from "react-router-dom";
import NavBar from "./components/layouts/NavBar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Landing from "./components/layouts/Landing";

//const cors = require('cors');
//app.use(cors());
const AppRoutes = () => {
    return useRoutes([
       { path: "/", element: <Landing /> },
        {path: "/register", element: <Register/>},
        {path: "/login", element: <Login/>},
    ]);
  };
const  App = ()=> {
  return (
  <Fragment>
    <Router>
   <NavBar/>
    <AppRoutes />
  </Router>
  </Fragment>
  )
}

export default App;
