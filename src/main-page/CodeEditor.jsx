import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { VscDebugStart } from "react-icons/vsc";
import { BiWindowClose } from "react-icons/bi";
import "./../CodeEditor.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Polygon1 from "../assets/Polygon 1.svg"; 
import RotateCW from "../assets/rotate-cw.svg"; 
import SolvroLogo from "../assets/solvro-big-logo.svg"; // Import the SVG file

const CodeEditor = ({
  onExecute,
  isError,
  numCubes,
  setNumCubes,
  setReset,
  code,
  setCode,
  visibleIndex,
  setVisibleIndex,
  setUploadCode,
}) => {
  const navigate = useNavigate();
  const [tempCubes, setTempCubes] = useState(numCubes);

  useEffect(() => {
    localStorage.setItem("code", JSON.stringify(code));
  }, [code]);

  useEffect(() => {
    if (isError === true) {
      toast.error("There is an error in your code!");
    }
  }, [isError]);

  useEffect(() => {
    localStorage.setItem("visibleIndex", JSON.stringify(visibleIndex));
  }, [visibleIndex]);
  // local storage things

  const handleVisibility = (index) => {
    setVisibleIndex(index);
  };

  const handleTextChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const addTextarea = () => {
    setCode([...code, ""]);
    setVisibleIndex(code.length);
  };

  const removeTextarea = (index) => {
    if (code.length > 1) {
      const newCode = code.filter((_, i) => i !== index);
      setCode(newCode);
      setVisibleIndex((prevIndex) =>
        prevIndex >= newCode.length ? newCode.length - 1 : prevIndex
      );
    } else {
      setCode([""]);
      setVisibleIndex(0);
    }
  };

  const handleSelectChange = (event) => {
    const value = parseInt(event.target.value);
    setTempCubes(value);
    setNumCubes(value);
  };

  const handleExecute = () => {
    onExecute(code[visibleIndex]);
  };
  const handleResetScene = () => {
    setReset((prev) => ++prev);
  };
  const handleUploadCode = () => {
    // NA RAZIE BRAKUJE WERYFIKACJI, CZY ANIMACJA JEST POPRAWNA!!!!!!!!!!!!!!!
    setUploadCode(code[visibleIndex]);
    navigate("/upload", { replace: true });
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* <div className="header-container">
        <img src={SolvroLogo} alt="Solvro Logo" className="solvro-logo" />
      </div> */}
      <div className="tab-container">
        {code.map((_, index) => (
          <div
            key={index}
            className={"tab-window"}
            onClick={() => handleVisibility(index)}
          >
            Page {index + 1}
            <button
              onClick={() => removeTextarea(index)}
              className="delete-button"
            >
              x
            </button>
            {visibleIndex === index && <div className="window-active"></div>}
          </div>
        ))}
        <button className="add-icon" onClick={addTextarea}>+</button>
      </div>
      <div className="text-area-container">
        {code.map((text_area_code, index) => (
          <CodeMirror
            extensions={[javascript({ jsx: true })]}
            key={index}
            theme={vscodeDark}
            className={`text-area ${visibleIndex === index ? "visible" : ""}`}
            value={text_area_code}
            onChange={(value) => handleTextChange(value, index)}
            style={{ borderColor: isError ? "red" : "black" }}
          />
        ))}
      </div>
      <div className="button-container">
        <button className="execute-button" onClick={handleExecute}>
          <img src={Polygon1} alt="Execute" className="execute-icon" />
        </button>
        <button className="execute-button" onClick={handleResetScene}>
          <img src={RotateCW} alt="Reset Scene" className="execute-icon" />
        </button>
        <button className="execute-button" onClick={handleUploadCode}>
          Upload animation
        </button>
      </div>
      <div>
        <select className="select-button" value={tempCubes} onChange={handleSelectChange}>
          <option value="5">5x5x5</option>
          <option value="6">6x6x6</option>
          <option value="7">7x7x7</option>
          <option value="8">8x8x8</option>
          <option value="9">9x9x9</option>
          <option value="10">10x10x10</option>
        </select>
      </div>
    </div>
  );
};

export default CodeEditor;
