import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./admin/components/viewes/Home";
import AdminLayout from "./admin/components/layout/AdminLayout";
import AuthSignIn from "./admin/components/layout/AuthSignIn";
import UserList from "./admin/components/viewes/UserList";
import AdminAuthGuard from "./authGuard/AdminAuthGuard";
// Author
import AuthorsList from "./admin/components/viewes/Authors/AuthorsList";
import CreateAuthor from "./admin/components/viewes/Authors/CreateAuthor";
import EditAuthor from "./admin/components/viewes/Authors/EditAuthor";
//Publishers
import PublishersList from "./admin/components/viewes/Publisher/PublishersList";
import CreatePublisher from "./admin/components/viewes/Publisher/CreatePublisher";
import EditPublisher from "./admin/components/viewes/Publisher/EditPublisher";
//Country
import CountryList from "./admin/components/viewes/Country/CountryList";
import CreateCountry from "./admin/components/viewes/Country/CreateCountry";
import EditCountry from "./admin/components/viewes/Country/EditCountry";
//Language
import LanguageList from "./admin/components/viewes/Language/LanguageList";
import CreateLanguage from "./admin/components/viewes/Language/CreateLanguage";
import EditLanguage from "./admin/components/viewes/Language/EditLanguage";
//Category
import CategoryList from "./admin/components/viewes/Category/CategoryList";
//sub-categories
import SubCategoryList from "./admin/components/viewes/SubCategory/SubCategoryList";

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
                  <Route path="list" element={<AuthorsList />} />
                  <Route path="create" element={<CreateAuthor />} />
                  <Route path="edit/:authorId" element={<EditAuthor />} />
                </Route>

                {/* Publishers */}
                <Route path="publishers/">
                  <Route path="list" element={<PublishersList />} />
                  <Route path="create" element={<CreatePublisher />} />
                  <Route path="edit/:publisherId" element={<EditPublisher />} />
                </Route>

                {/* Countries */}
                <Route path="countries/">
                  <Route path="list" element={<CountryList />} />
                  <Route path="create" element={<CreateCountry />} />
                  <Route path="edit/:countryId" element={<EditCountry />} />
                </Route>

                {/* languages */}
                <Route path="languages/">
                  <Route path="list" element={<LanguageList />} />
                  <Route path="create" element={<CreateLanguage />} />
                  <Route path="edit/:languageId" element={<EditLanguage />} />
                </Route>
                {/* Category */}
                <Route path="categories/">
                  <Route path="list" element={<CategoryList />} />
                </Route>
                {/*Sub Category */}
                <Route path="sub-categories/">
                  <Route path="list" element={<SubCategoryList />} />
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
