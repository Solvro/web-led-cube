import './App.css';
import CubeScene from './components/CubeScene';
import CodeEditor from './components/CodeEditor';
import { useState, useRef } from "react";

function App() {
    const [code, setCode] = useState("");
    const [isError, setIsError] = useState(false);
    const [editorWidth, setEditorWidth] = useState(600);
    const [isEditorVisable, setIsEditorVisable] = useState(true);
    const minEditorWidth = 200;
    const previousMouseX = useRef(null);

    const handleExecuteCode = (newCode) => {
        setCode(newCode);
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
    };

    function toggleEditorVisibility () {
        setIsEditorVisable(!isEditorVisable)
    };

    return (
        <div className="App">
            <div className="container">
                <CubeScene code={code} setIsError={setIsError} isEditorVisible={isEditorVisable} />
                <div className={`code-editor ${isEditorVisable ? '' : 'hidden'}`} style={{ width: editorWidth }}>
                    <button className='toggle-button' onClick={toggleEditorVisibility}>
                        {isEditorVisable ? 'V' : "Ʌ"}
                    </button>
                    <div className="resizer" onMouseDown={handleMouseDown} />
                    <CodeEditor onExecute={handleExecuteCode} isError={isError} />
                </div>
            </div>
        </div>
    );
}

export default App;
