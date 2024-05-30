import React, {useState} from "react";


const CodeEditor = ({ onExecute, isError }) => {

    const [code, setCode] = useState("")

    const handleChange = (e) => {
        setCode(e.target.value);
    };

    const handleExecute = () => {
        onExecute(code);
    };

    return (
        <div className="code-editor">
            <textarea
                value={code}
                onChange={handleChange}
                style={{ borderColor: isError ? "red" : "black" }}
            />
            <button onClick={handleExecute}>Execute Code</button>
        </div>
    );
}

export default CodeEditor;
