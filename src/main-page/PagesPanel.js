import React, { useState } from "react";
import "./../MainPage.css";
import "./subpages.css";
import CodeEditor from "./CodeEditor";
import Projects from "./ProjectsManager/Projects";
//tymczasowe podejście
//this is a panel that displays tabs that switch to different pages like
// tutorial, upload etc.
const PagesPanel = ({ onExecute, isError , numCubes, setNumCubes, setReset, isVisible }) => {
  const [chosenPage, setChosenPage] = useState(1);

  const pages = [
    { 
      number: 1, 
      text: "Code", 
      icon: "", 
      content: <CodeEditor
      onExecute={onExecute}
      isError={isError}
      numCubes={numCubes}
      setNumCubes={setNumCubes}
      setReset={setReset}
    />
    },
    { 
      number: 2, 
      text: "Projects", 
      icon: "", 
      content: <Projects chosenPage={chosenPage}/>
    },
    { 
      number: 3, 
      text: "Info", 
      icon: "", 
      content: <div>Adjust your Settings here.</div> 
    },
    { 
      number: 4, 
      text: "Settings", 
      icon: "", 
      content: <div>Adjust your Settings here.</div> 
    },
  ];

  const switchSubPage = (index) => {
    setChosenPage(index);
  };
  

  return (
    <div className={`code-editor-container ${isVisible ? "" : "sub-page-hidden"}`}>
      {/* Tabs */}
      <div className="sub-tabs-container">
        {pages.map(({ number, text, icon }) => (
          <div key={number} className="sub-tab-container">
            <div className={`sub-tab-wall ${chosenPage === number ? "sub-active" : ""}`}><div className="colored-left"></div></div>
            <button onClick={() => switchSubPage(number)} className={`sub-tab-button ${chosenPage === number ? "sub-active" : ""}`}>
              {icon} {text}
            </button>
            <div className={`sub-tab-wall ${chosenPage === number ? "sub-active" : ""}`}><div className="colored-right"></div></div>
          </div>
        ))}
      </div>
        {/* TO DO: make a react router to make visibility issues not a living hell */}
      {/* Page Content */}
      <div className={`sub-page-content-container`}>
        {/* {pages.find(({ page }) => page === chosenPage)?.content} */}
        {pages.map((page) => (
          <div key={page.number} className={`sub-page-content ${chosenPage === page.number ? "sub-active-content" : ""}`}>
              {page.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PagesPanel;
