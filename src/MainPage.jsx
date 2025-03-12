import "./MainPage.css";
import { useState, useRef } from "react";
import { VscChevronDown, VscChevronUp } from "react-icons/vsc";
import PagesPanel from "./main-page/PagesPanel";
import { Scenes } from "./main-page/Scenes";

export const MainPage = ({execute, reset, code, setIsError, numCubes}) => {
  const [editorWidth, setEditorWidth] = useState(600);
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [cubeSceneVisible, setCubeSceneVisible] = useState(true); // State for visibility
  const [cubeSceneKey, setCubeSceneKey] = useState(0); // State for CubeScene key
  const minEditorWidth = 400;
  const previousMouseX = useRef(null);


  const handleMouseDown = (event) => {
    event.preventDefault();
    previousMouseX.current = event.clientX;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    const deltaX = event.clientX - previousMouseX.current;
    previousMouseX.current = event.clientX;
    setEditorWidth((prevWidth) => Math.max(minEditorWidth, prevWidth - deltaX) > 360 ? Math.max(minEditorWidth, prevWidth - deltaX) : 360);
  };
  console.log("isEditorVisible in parent:", isEditorVisible);
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    // First, hide the CubeScene
    setCubeSceneVisible(false);
    // After the transition duration, update the key and make it visible again
    setTimeout(() => {
      setCubeSceneKey((prevKey) => prevKey + 1);
      setCubeSceneVisible(true);
    }, 400); // 300ms matches the transition duration
  };

  return (
    <div className="main-page">
      <div className="mp-container">
        <Scenes
          execute={execute}
          reset={reset}
          key={cubeSceneKey}
          code={code}
          setIsError={setIsError}
          numCubes={numCubes}
        />
        <div
          className={`mp-panels`}
          style={{ width: editorWidth }}
        >
          <div className="resizer" onMouseDown={handleMouseDown} />
          
          <PagesPanel
          />
        </div>
      </div>
    </div>
  );
}