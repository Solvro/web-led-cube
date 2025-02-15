import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import toast from 'react-hot-toast';
const ANIM_URL = "http://127.0.0.1:8000/animations/";

export const Test2 = () => {
    const [data, setData] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const getData = async () => {
        try {
          const response = await axiosPrivate.get(
            ANIM_URL,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          setData(response.data);
          toast.success("Animations retrieved");
        } catch (err) {
          if (!err?.response) {
            toast.error("Error " + err?.response);
          }
        }
      };
    
      return (
        <div>
            <button onClick={() => getData()}>
                GET DATA
            </button>
          {data.map((item) => (
            <div key={item.id} className="item-container">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p><strong>Animation:</strong> {item.animation}</p>
            </div>
          ))}
        </div>
      );
    };
