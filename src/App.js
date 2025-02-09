import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./pages/Layout";
import MainPage from "./MainPage";
import MissingPage from "./pages/MissingPage";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./pages/Unauthorized";
import { Toaster } from "react-hot-toast";
import CodeEditor from "./main-page/CodeEditor";
import Projects from "./main-page/ProjectsManager/Projects";
import { YourProjects } from "./main-page/ProjectsManager/YourProjects";

// it's only temporary of course
const ROLES = {
  User: 2001,
};

const App = () => {
  const [code, setCode] = useState("");
  const [execute, setExecute] = useState(0); // that's stupid and temporary aproach to trigger useEffect even when the code does not change
  const [reset, setReset] = useState(0); // same aproach for reset button - easy to correct but I have no idea
  const [isError, setIsError] = useState(false);
  const [numCubes, setNumCubes] = useState(6);


  const handleExecuteCode = (newCode) => {
    setCode(newCode);
    setExecute((prev) => ++prev);
  };
  return (
    <>
      <Toaster />
      {/* notifications - react-hot-toaster */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<MainPage execute={execute} handleExecuteCode={handleExecuteCode} reset={reset} setReset={setReset} code={code} numCubes={numCubes} setNumCubes={setNumCubes} isError={isError} setIsError={setIsError}/>}>
            <Route index element={<CodeEditor
          onExecute={handleExecuteCode}
          setReset={setReset}
          numCubes={numCubes}
          setNumCubes={setNumCubes}
          isError={isError}
          />} />
            <Route path="projects" element={<Projects />}>
              <Route index element={<YourProjects/> }/>
              <Route path="saved" element={<div>XDD</div>}/>
              <Route path="discover" element={<div>XDDD</div>}/>
            </Route>
            <Route
              path="info"
              element={<div>Adjust your Settings here.</div>}
            />
            <Route
              path="settings"
              element={<div>Adjust your Settings here.</div>}
            />
          </Route>
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
