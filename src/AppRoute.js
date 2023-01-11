import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Admin/Components/Pages/Home";
import Admin from "./Admin/Components/Layout/Admin";
import AuthSignIn from "./Admin/Components/Layout/AuthSignIn";
import UserList from "./Admin/Components/Pages/UserList";
import AdminAuthGuard from "./AuthGuard/AdminAuthGuard";

const AppRoute = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthSignIn />} />
          <Route element={<Admin />}>
            <Route element={<AdminAuthGuard />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/user-list" element={<UserList />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default AppRoute;
