import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from 'react-hot-toast';

const ANIM_URL = "http://127.0.0.1:8000/animations/";

export const Test = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [code, setCode] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post(
        ANIM_URL,
        JSON.stringify({ name: name, description: desc, animation: code }),
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
    } catch (err) {
      if (!err?.response) {
        toast.error("Error " + err?.response);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="label-input-section">
          <label htmlFor="name">NAME</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            placeholder="Enter anim name"
          />
        </div>
        <div className="label-input-section">
          <label htmlFor="desc">DESCTRIPTION</label>
          <input
            type="text"
            id="desc"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            required
            placeholder="Enter description"
          />
        </div>
        <div className="label-input-section">
          <label htmlFor="code">CODE</label>
          <input
            type="text"
            id="code"
            onChange={(e) => setCode(e.target.value)}
            value={code}
            required
            placeholder="Enter code"
          />
        </div>
        <button type="submit" className="sign-in-button">
          SUBMIT
        </button>
      </form>
    </div>
  );
};
