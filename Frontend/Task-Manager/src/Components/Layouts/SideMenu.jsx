import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../Contexts/UserContext'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SideMenu = ({activeMenu}) => {
const {user,clearUser}=useContext(UserContext);
const [sideMenuData, setSideMenuData] =useState([]);

const navigate =useNavigate();

const handleClick=(route)=>{
    if(route === "logout"){
        handelLogout();
        return;
    }

    navigate(route);
};

const handelLogout =()=>{
    localStorage.clear();
    clearUser();
    navigate("/login");
};

useEffect(() =>{
    if(user){
        setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
    }
})
}

export default SideMenu
