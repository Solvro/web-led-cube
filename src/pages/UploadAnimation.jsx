import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { VscDebugStart } from "react-icons/vsc";
import "./UploadAnimation.css"

const ANIM_URL = "http://127.0.0.1:8000/animations/";

export const UploadAnimation = ({ uploadCode, setUploadCode }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(()=>{
    if(uploadCode === ""){
      toast.success("Select a code to submit!");
      navigate("/", { replace: true });
    }
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post(
        ANIM_URL,
        JSON.stringify({
          name: name,
          description: desc,
          animation: uploadCode,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const Aid = response?.data?.id;
      const Aowner = response?.data?.owner;
      const Aname = response?.data?.name;
      const Adescription = response?.data?.description;
      const Aanimation = response?.data?.animation;
      console.log(Aid + Aowner + Aname + Adescription + Aanimation);
      toast.success("Animation Submited");
      setUploadCode("");
      navigate("/", { replace: true });
    } catch (err) {
      if (!err?.response) {
        toast.error("Error " + err?.response);
      }
    }
  };

  return (
    <div className="upload-container">
      <button onClick={() => navigate("/", {replace: true})}>Back</button>
      <form onSubmit={handleSubmit}>
        <div className="upload-input-section">
          <label htmlFor="name" className="upload-label">NAME</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            placeholder="Enter anim name"
            className="upload-input"
          />
        </div>
        <div className="upload-input-section">
          <label htmlFor="desc" className="upload-label">DESCTRIPTION</label>
          <input
            type="text"
            id="desc"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            required
            placeholder="Enter description"
            className="upload-input"
          />
        </div>
        <CodeMirror
            extensions={[javascript({ jsx: true })]}
            theme={vscodeDark}
            value={uploadCode}
            readOnly={true}
            className="text-area upload upload-text-area"
          />
        <button type="submit" className="submit-button">
          SUBMIT
        </button>
      </form>
    </div>
  );
};
