import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Admin/Components/Pages/Home";
import AdminLayout from "./Admin/Components/Layout/AdminLayout";
import AuthSignIn from "./Admin/Components/Layout/AuthSignIn";
import UserList from "./Admin/Components/Pages/UserList";
import AdminAuthGuard from "./AuthGuard/AdminAuthGuard";
import AllAuthorsList from "./Admin/Components/Pages/Authors/AllAuthorsList";
import CreateAuthor from "./Admin/Components/Pages/Authors/CreateAuthor";
import EditAuthor from "./Admin/Components/Pages/Authors/EditAuthor";

const AppRoute = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/">
            <Route path="login/admin" element={<AuthSignIn />} />

            <Route path="admin/" element={<AdminLayout />}>
              <Route element={<AdminAuthGuard />}>
                <Route path="dashboard" element={<Home />} />
                <Route path="user-list" element={<UserList />} />

                {/* Author */}
                <Route path="authors/">
                  <Route path="list" element={<AllAuthorsList />} />
                  <Route path="create" element={<CreateAuthor />} />
                  <Route path="edit/:authorId" element={<EditAuthor />} />
                  <Route path="show" element={<AllAuthorsList />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default AppRoute;
