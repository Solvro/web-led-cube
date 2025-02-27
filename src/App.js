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
import { Test } from "./pages/Test";
import { Test2 } from "./pages/Test2";
import { SavedProjects } from "./main-page/ProjectsManager/SavedProjects";
import { DiscoverProjects } from "./main-page/ProjectsManager/DiscoverProjects";
import Tutorial from "./main-page/ProjectsManager/Tutorial";

const App = () => {
  const [code, setCode] = useState("");
  const [execute, setExecute] = useState(0); // that's stupid and temporary aproach to trigger useEffect even when the code does not change
  const [reset, setReset] = useState(0); // same aproach for reset button - easy to correct but I have no idea
  const [isError, setIsError] = useState(false);
  const [numCubes, setNumCubes] = useState(5);

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
          <Route
            path="/"
            element={
              <MainPage
                execute={execute}
                handleExecuteCode={handleExecuteCode}
                reset={reset}
                setReset={setReset}
                code={code}
                numCubes={numCubes}
                setNumCubes={setNumCubes}
                isError={isError}
                setIsError={setIsError}
              />
            }
          >
            <Route
              index
              element={
                <CodeEditor
                  onExecute={handleExecuteCode}
                  setReset={setReset}
                  numCubes={numCubes}
                  setNumCubes={setNumCubes}
                  isError={isError}
                />
              }
            />
            <Route path="projects" element={<Projects />}>
              <Route element={<RequireAuth />}>
                <Route index element={<YourProjects />} />
                <Route path="saved" element={<SavedProjects/>} />
                <Route path="discover" element={<DiscoverProjects/>} />
              </Route>
            </Route>
            <Route
              path="info"
              element={<div>Informacje są tutaj!</div>}
            />
            <Route
              path="tutorial"
              element={<Tutorial/>}
            />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          <Route element={<RequireAuth />}>
            <Route path="test" element={<Test />} />
            <Route path="test2" element={<Test2 />} />
          </Route>

          {/* "*" is the rest of paths that are not stated*/}
          <Route path="*" element={<MissingPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
