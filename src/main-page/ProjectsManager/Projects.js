import { useState } from 'react';
import "./projectManager.css";
import { YourProjects } from './YourProjects';

const pages = [
    { 
      number: 1, 
      text: "Zapisane", 
      icon: "", 
      content: <YourProjects/>
    },
    { 
      number: 2, 
      text: "Polubione", 
      icon: "", 
      content: <div>XDD</div>
    },
    { 
      number: 3, 
      text: "Odkrywaj", 
      icon: "", 
      content: <div>XDDD</div> 
    },
  ];

const Projects = ({chosenPage}) => {
  const [chosenSubPage, setChosenSubPage] = useState(1);
  const switchSubPage = (index) => {
    setChosenSubPage(index);
  };
  return (
    <div style={{ width: "100%", height: "100%", visibility: chosenPage === 2 ? "visible" : "hidden" }}>
      <div className='container'>
      <div className="projects-tabs-container">
        {pages.map(({ number, text, icon }) => (
          <div key={number} className="projects-tab-container">
            <button onClick={() => switchSubPage(number)} className={`projects-tab-button`}>
              {icon} {text}
            </button>
            <div className={`projects-tabs-underline ${chosenSubPage === number ? "projects-active" : ""}`}></div>
          </div>
        ))}
        
      </div>
      <div className='projects-tab-underline'></div>
      </div>
      <div className={`sub-page-content-container`}>
        {pages.map((page) => (
          <div key={page.number} className={`sub-page-content ${chosenSubPage === page.number && chosenPage === 2 ? "sub-active-content" : ""}`}>
              {page.content}
          </div>
        ))}
      </div>

    </div>
  )
}

export default Projects;