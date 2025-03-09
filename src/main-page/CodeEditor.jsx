import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { VscDebugStart } from "react-icons/vsc";
import { BiWindowClose } from "react-icons/bi";
import "./../CodeEditor.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

  const handleSliderChange = (event) => {
    setTempCubes(event.target.value);
  };

  const handleSliderBlur = () => {
    setNumCubes(tempCubes);
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
      <div className="tab-container">
        {code.map((_, index) => (
          <div
            key={index}
            className={"tab-window"}
            onClick={() => handleVisibility(index)}
          >
            Page {index + 1}
            <BiWindowClose
              onClick={() => removeTextarea(index)}
              className="delete-icon"
            />
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
      <button onClick={handleExecute}>
        <VscDebugStart />
      </button>
      <button onClick={handleResetScene}>Reset Scene</button>
      <button onClick={handleUploadCode}>Upload animation</button>
      <div>
        <input
          type="range"
          min="5"
          max="10"
          step="1"
          value={tempCubes}
          onChange={handleSliderChange}
          onBlur={handleSliderBlur}
        />
        <div style={{ color: "white" }}>{tempCubes}</div>
      </div>
    </div>
  );
};

export default CodeEditor;
