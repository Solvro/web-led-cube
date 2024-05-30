import './App.css';
import CubeScene from './components/CubeScene';
import CodeEditor from './components/CodeEditor';
import {useState} from "react";


function App() {

    const [code, setCode] = useState("")
    const [isError, setIsError] = useState(false);


    const handleExecuteCode = (newCode) => {
        setCode(newCode);
    };

    return (
        <div className="App">
            <CubeScene code={code} setIsError={setIsError} />
            <CodeEditor onExecute={handleExecuteCode} isError={isError} />
        </div>
  );
}

export default App;
