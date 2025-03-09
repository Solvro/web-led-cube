import "./projectManager.css";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const pages = [
    { 
      number: 1, 
      text: "Zapisane", 
      path: ""
    },
    { 
      number: 2, 
      text: "Odkrywaj",
      path: "discover"
    },
  ];

export const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();

  
  const isActive = (path) => {
    return path === "" 
    ? location.pathname === "/projects" || location.pathname === "/projects/"
    : location.pathname === `/projects/${path}`;
  };
  return (
    <div style={{ width: "100%", height: "100%"}}>
      <div className='container'>
      <div className="projects-tabs-container">
        {pages.map(({ number, text, path }) => (
          <div key={number} className="projects-tab-container">
            <button onClick={() => navigate(path)} className={`projects-tab-button`}>
              {text}
            </button>
            <div className={`projects-tabs-underline ${isActive(path) ? "projects-active" : ""}`}></div>
          </div>
        ))}
        
      </div>
      <div className='projects-tab-underline'></div>
      </div>
      <div className={`sub-page-content-container`}>
        <Outlet/>
      </div>

    </div>
  )
}