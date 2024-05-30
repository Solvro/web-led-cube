import React, {useState} from "react";


const CodeEditor = ({ onExecute }) => {

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
            />
            <button onClick={handleExecute}>Execute Code</button>
        </div>
    );
}

export default CodeEditor;
