import React from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./pages/Layout";
import MainPage from "./MainPage";
import MissingPage from "./pages/MissingPage";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./pages/Unauthorized";
import { Toaster } from "react-hot-toast";

// it's only temporary of course
const ROLES = {
  User: 2001,
};

const App = () => {
  return (
    <>
      <Toaster />
      {/* notifications - react-hot-toaster */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            {/* This is for the future, checks for roles and if the user does not have
        a certain role, they are brought login*/}
            <Route path="uploadtocube" element={""} />
          </Route>

          {/* "*" is the rest of paths that are not stated*/}
          <Route path="*" element={<MissingPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
