import React, {useState} from "react";


const CodeEditor = ({ onExecute, isError }) => {

    const [code, setCode] = useState(["/* Kod idzie tutaj */"]);
    // const [buttonCount, setButtonCount] = useState(2);
    const [visibleIndex, setVisibleIndex] = useState(0);

    const handleVisibility = (index) => {
        setVisibleIndex(index);
    };

    const handleTextChange = (e, index) => {
        const newCode = [...code];
        newCode[index] = e.target.value;
        setCode(newCode);
    };

    const handleExecute = () => {
        onExecute(code[visibleIndex]);
    };

    const addTextarea = () => {
        setCode([...code, ""]);
        setVisibleIndex(code.length);
    };

    const removeTextarea = () => {
        if (code.length > 1) {
          setCode(code.slice(0, -1));
          setVisibleIndex(code.length - 2);
        }
    };

    return (
        <div className="code-editor">
            <div className="buttons-container">
                {code.map((_, index) => (
                <button 
                key={index} 
                className={`tab-button ${(code[index] !== "" && visibleIndex !== index) ? 'button-not-empty' : ''} ${visibleIndex === index ? 'button-active' : ''}`}
                onClick={() => handleVisibility(index)}>{index + 1}</button>
                ))}
            </div>
            <div className="text-area-container">
                {code.map((text_area_code, index) => (
                <textarea
                key={index}
                className={`text-area ${visibleIndex === index ? 'visible' : ''}`}
                value={text_area_code}
                onChange={(e) => handleTextChange(e, index)}
                style={{ borderColor: isError ? "red" : "black" }}/>
                ))}
            </div>
            {/* <button>Add</button> */}
            <div className="control-buttons">
                <button className="tab-button" onClick={addTextarea}>Add New Textarea</button>
                <button className="tab-button" onClick={removeTextarea}>Remove Last Textarea</button>
            </div>
            <button onClick={handleExecute}>Execute Code</button>
        </div>
    );
}

export default CodeEditor;
