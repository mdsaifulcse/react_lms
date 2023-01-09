import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Admin/Components/Pages/Home";
import Admin from "./Admin/Components/Layout/Admin";
import AuthSignIn from "./Admin/Components/Layout/AuthSignIn";
import UserList from "./Admin/Components/Pages/UserList";

const AppRoute = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthSignIn />} />
          <Route element={<Admin />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/user-list" element={<UserList />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default AppRoute;
