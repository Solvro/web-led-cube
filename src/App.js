import './App.css';
import CubeScene from './components/CubeScene';
import CodeEditor from './components/CodeEditor';
import {useState} from "react";


function App() {

    const [code, setCode] = useState("")

    const handleExecuteCode = (newCode) => {
        setCode(newCode);
    };

    return (
        <div className="App">
            <CubeScene code={code} />
            <CodeEditor onExecute={handleExecuteCode} />
        </div>
  );
}

export default App;
