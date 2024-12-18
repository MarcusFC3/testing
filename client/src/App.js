import {
    Route, Routes,
    BrowserRouter
  } from "react-router-dom";
import React from "react";

import Home from "./pages/home"
import Activities from "./pages/activities"
import Leaderboard from "./pages/leaderboards"
import Sign_Up from "./pages/sign_up"
import Login from "./pages/login"
import Layout from "./components/Layout"

import "./css/stylesheet.css"

const App = () =>{
    return (<div className="container">
    <BrowserRouter exact path="/">
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />}/>
                <Route path="home" element={<Home />}/>
                <Route path="activities" element={<Activities />} />
                <Route path="leaderboards" element={<Leaderboard />} />
                <Route path="sign_up" element={<Sign_Up />} />
                <Route path="login" element={<Login />} />
            </Route>
        </Routes> 
    </BrowserRouter>
    </div>)
}

export default App;