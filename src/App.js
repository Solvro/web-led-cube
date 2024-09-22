import './App.css';
import CubeScene from './components/CubeScene';
import CodeEditor from './components/CodeEditor';
import { useState, useRef } from "react";

import { VscChevronDown, VscChevronUp } from "react-icons/vsc";

function App() {
    const [code, setCode] = useState("");
    const [execute, setExecute] = useState(""); // that's stupid and temporary aproach to trigger useEffect even when the code does not change
    // I wanted to use Providers and context, but something does not work i don't know what - i will fix it later
    const [isError, setIsError] = useState(false);
    const [editorWidth, setEditorWidth] = useState(600);
    const [isEditorVisible, setIsEditorVisible] = useState(true);
    const [cubeSceneVisible, setCubeSceneVisible] = useState(true); // State for visibility
    const [cubeSceneKey, setCubeSceneKey] = useState(0); // State for CubeScene key
    const minEditorWidth = 200;
    const previousMouseX = useRef(null);

    const handleExecuteCode = (newCode) => {
        setCode(newCode);
        if(execute === 1){
            setExecute(0);
        }else{
            setExecute(1);
        }
    };

    const handleMouseDown = (event) => {
        event.preventDefault();
        previousMouseX.current = event.clientX;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event) => {
        const deltaX = event.clientX - previousMouseX.current;
        previousMouseX.current = event.clientX;
        setEditorWidth(prevWidth => Math.max(minEditorWidth, prevWidth - deltaX));
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        // First, hide the CubeScene
        setCubeSceneVisible(false);
        // After the transition duration, update the key and make it visible again
        setTimeout(() => {
            setCubeSceneKey(prevKey => prevKey + 1);
            setCubeSceneVisible(true);
        }, 400); // 300ms matches the transition duration
    };

    const toggleEditorVisibility = () => {
        setIsEditorVisible(!isEditorVisible);
        // Force re-render of CubeScene when toggling editor visibility
        setCubeSceneVisible(false);
        setTimeout(() => {

            setCubeSceneVisible(true);
        }, 400);
        setCubeSceneKey(prevKey => prevKey + 1);
    };

    return (
        <div className="App">
            <div className="container">
                <CubeScene
                    execute={execute}
                    key={cubeSceneKey} 
                    code={code} 
                    setIsError={setIsError} 
                    isEditorVisible={isEditorVisible}
                    className={`cube-scene ${cubeSceneVisible ? '' : 'hidden'}`} 
                />
                <div className={`code-editor ${isEditorVisible ? '' : 'hidden'}`} style={{ width: editorWidth }}>
                    <button className='toggle-button' onClick={toggleEditorVisibility}>
                        {isEditorVisible ? <VscChevronDown /> : <VscChevronUp />}
                    </button>
                    <div className="resizer" onMouseDown={handleMouseDown} />
                    <CodeEditor onExecute={handleExecuteCode} isError={isError} />
                </div>
            </div>
        </div>
    );
}

export default App;
