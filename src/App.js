import './App.css';
import CubeScene from './components/CubeScene';
import CodeEditor from './components/CodeEditor';
import { useState } from "react";

function App() {
    const [code, setCode] = useState("");
    const [isError, setIsError] = useState(false);
    const [editorWidth, setEditorWidth] = useState(600);
    const minEditorWidth = 100;

    const handleExecuteCode = (newCode) => {
        setCode(newCode);
    };

    const handleMouseDown = (event) => {
        event.preventDefault(); 
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp); 
    }

    const handleMouseMove = (event) => {
        setEditorWidth(prevWidth => Math.max(minEditorWidth,prevWidth - event.movementX));
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="App">
            <div className="container">
                <CubeScene code={code} setIsError={setIsError} />
                <div className="code-editor" style={{ width: editorWidth }}>
                    <div className="resizer" onMouseDown={handleMouseDown} />
                    <CodeEditor onExecute={handleExecuteCode} isError={isError} />
                </div>
            </div>
        </div>
    );
}

export default App;
