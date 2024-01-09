import React, { useEffect, useState } from 'react';
import { useRoutes, useNavigate } from "react-router-dom";
import { getUsers } from "../api/data";
import Home from '../pages/home';
import Login from '../pages/login';

function Router() {
    const [userData, setUserData] = useState([]);

    const navigate = useNavigate();
    const name = localStorage.getItem("USER_NAME");

    const userList = async () => {
        const res = await getUsers();
        return setUserData(res)
    }

    useEffect(() => {
        userList();
    }, [])

    useEffect(() => {
      if(!!name) {
         navigate("/home")
       }else {
         navigate("/")
       }
    }, [])
 
    const routes = useRoutes([
        {
            path: "/",
            element: <Login userData={userData} />
        },
        {
            path: "/home",
            element: <Home />
        },
    ])
    return routes;
}

export default Router
