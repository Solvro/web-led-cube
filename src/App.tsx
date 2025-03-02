import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { MainPage } from "./MainPage";
import { MissingPage } from "./pages/MissingPage";
import { Login } from "./pages/Login";
import { Registration } from "./pages/Registration";
import { RequireAuth } from "./components/RequireAuth";
import { Unauthorized } from "./pages/Unauthorized";
import { Toaster } from "react-hot-toast";
import { CodeEditor } from "./main-page/CodeEditor";
import { Projects } from "./main-page/ProjectsManager/Projects";
import { YourProjects } from "./main-page/ProjectsManager/YourProjects";
import { Test2 } from "./pages/Test2";
import { SavedProjects } from "./main-page/ProjectsManager/SavedProjects";
import { DiscoverProjects } from "./main-page/ProjectsManager/DiscoverProjects";
import { UploadAnimation } from "./pages/UploadAnimation";
import { Tutorial } from "./main-page/Tutorial";

const App = () => {
  const [executedCode, setExecutedCode] = useState("");
  const [uploadCode, setUploadCode] = useState("");
  const [reset, setReset] = useState(0); // same aproach for reset button - easy to correct but I have no idea
  const [execute, setExecute] = useState(0);
  const [isError, setIsError] = useState(false);
  const [numCubes, setNumCubes] = useState(5);

  const [code, setCode] = useState(() => {
    const storedCode = localStorage.getItem("code");
    return storedCode ? JSON.parse(storedCode) : ["/* Kod idzie tutaj */"];
  });

  const [visibleIndex, setVisibleIndex] = useState(() => {
    const savedIndex = localStorage.getItem("visibleIndex");
    if (!savedIndex || savedIndex === "undefined") {
      return 0;
    }
    return JSON.parse(savedIndex);
  });

  const handleExecuteCode = (newCode) => {
    setExecutedCode(newCode);
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
                reset={reset}
                code={executedCode}
                numCubes={numCubes}
                setNumCubes={setNumCubes}
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
                  code={code}
                  setCode={setCode}
                  visibleIndex={visibleIndex}
                  setVisibleIndex={setVisibleIndex}
                  setUploadCode={setUploadCode}
                />
              }
            />
            <Route path="upload" element={<RequireAuth />}>
              <Route
                index
                element={
                  <UploadAnimation
                    uploadCode={uploadCode}
                    setUploadCode={setUploadCode}
                  />
                }
              />
            </Route>
            <Route path="projects" element={<Projects />}>
              <Route element={<RequireAuth />}>
                <Route
                  index
                  element={
                    <YourProjects
                      code={code}
                      setCode={setCode}
                      visibleIndex={visibleIndex}
                      setVisibleIndex={setVisibleIndex}
                      executeCode={handleExecuteCode}
                    />
                  }
                />
                <Route path="saved" element={<SavedProjects />} />
                <Route path="discover" element={<DiscoverProjects code={code}
                      setCode={setCode}
                      visibleIndex={visibleIndex}
                      setVisibleIndex={setVisibleIndex}
                      executeCode={handleExecuteCode}/>} />
              </Route>
            </Route>
            <Route path="info" element={<div>Informacje są tutaj!</div>} />
            <Route path="tutorial" element={<Tutorial />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          <Route element={<RequireAuth />}>
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
