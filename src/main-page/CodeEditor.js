import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { VscDebugStart } from "react-icons/vsc";
import { BiSolidPlusCircle } from "react-icons/bi";
import { BiWindowClose } from "react-icons/bi";
import "./../CodeEditor.css";

const CodeEditor = ({
  onExecute,
  isError,
  numCubes,
  setNumCubes,
  setReset,
}) => {
  const [tempCubes, setTempCubes] = useState(numCubes);
  const [code, setCode] = useState(() => {
    const savedCode = localStorage.getItem("code");
    return savedCode !== null
      ? JSON.parse(savedCode)
      : ["/* Kod idzie tutaj */"];
  });

  useEffect(() => {
    localStorage.setItem("code", JSON.stringify(code));
  }, [code]);

  const [visibleIndex, setVisibleIndex] = useState(() => {
    const savedIndex = localStorage.getItem("visibleIndex");
    return savedIndex !== null ? JSON.parse(savedIndex) : 0;
  });

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

  const addTextarea = () => {
    setCode([...code, ""]);
    setVisibleIndex(code.length);
  };

  const removeTextarea = () => {
    if (code.length > 1) {
      const newCode = code.slice(0, -1);
      setCode(newCode);
      setVisibleIndex(newCode.length - 1);
    }
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
            <BiWindowClose onClick={removeTextarea} className="delete-icon" />
            {visibleIndex === index && <div className="window-active"></div>}
          </div>
        ))}
        <BiSolidPlusCircle className="add-icon" onClick={addTextarea} />
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
      <button onClick={handleExecute} className="code-editor-button">
        <VscDebugStart />
      </button>
      <button onClick={handleResetScene} className="code-editor-button">
        Reset Scene
      </button>
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
