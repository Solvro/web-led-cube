import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { VscDiffAdded, VscDiffRemoved, VscDebugStart } from "react-icons/vsc";

const CodeEditor = ({ onExecute, isError }) => {

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

  const handleExecute = () => {
    onExecute(code[visibleIndex]);
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
    <div className="code-editor">
      <div className="buttons-container">
        {code.map((_, index) => (
          <button
            key={index}
            className={`tab-button ${
              code[index] !== "" && visibleIndex !== index
                ? "button-not-empty"
                : ""
            } ${visibleIndex === index ? "button-active" : ""}`}
            onClick={() => handleVisibility(index)}
          >
            {index + 1}
          </button>
        ))}
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
      <div className="control-buttons">
        <button className="tab-button" onClick={addTextarea}>
          <VscDiffAdded/>
        </button>
        <button className="tab-button" onClick={removeTextarea}>
          <VscDiffRemoved/>
        </button>
      </div>
      <button onClick={handleExecute}><VscDebugStart/></button>
    </div>
  );
};

export default CodeEditor;
