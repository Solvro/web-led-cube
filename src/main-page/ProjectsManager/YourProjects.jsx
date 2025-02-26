import DataTable, { createTheme } from "react-data-table-component";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ANIM_URL = "http://127.0.0.1:8000/animations/";

export const YourProjects = ({
  code,
  setCode,
  visibleIndex,
  setVisibleIndex,
  executeCode,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [dataResponse, setDataResponse] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserAnimations = async () => {
      try {
        const response = await axiosPrivate.get(ANIM_URL, {
          headers: { "Content-Type": "application/json" },
        });
        setDataResponse(response.data);
      } catch (err) {
        if (!err?.response) {
          console.error(err?.response);
        }
      }
    };
    getUserAnimations();
  }, []);

  useEffect(() => {
    localStorage.setItem("visibleIndex", JSON.stringify(visibleIndex));
  }, [visibleIndex]);
  useEffect(() => {
    localStorage.setItem("code", JSON.stringify(code));
  }, [code]);

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      wrap: true,
    },
    {
      name: "Author",
      selector: (row) => row.author,
    },
    {
        name: "Code1",
        selector: (row) => row.projectCode,
      },
    {
      name: "Code",
      button: true,
      cell: (row) => (
        <div>
          <button onClick={() => importCode(row.projectCode)}>Import</button>
          <button onClick={() => previewCode(row.projectCode)}>Preview</button>
        </div>
      ),
    },
  ];
  const previewCode = (projectCode) => {
    console.log(projectCode);
    executeCode(projectCode);
  };
  const importCode = (projectCode) => {
    setCode((prevCode) => {
        const newCode = [...prevCode, projectCode];
        setVisibleIndex(newCode.length - 1);
        return newCode;
    });

    navigate("/", { replace: true });
    toast.success("Code imported!");
  };
  const data = Array.isArray(dataResponse)
    ? dataResponse.map((project) => ({
        title: project.name,
        description: project.description,
        author: project.owner,
        projectCode: project.animation,
      }))
    : [];

  createTheme(
    "solarized",
    {
      text: {
        primary: "#268bd2",
        secondary: "#2aa198",
      },
      background: {
        default: "#191b20",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#073642",
      },
      button: {
        default: "#2aa198",
        hover: "rgba(0,0,0,.08)",
        focus: "rgba(255,255,255,.12)",
        disabled: "rgba(255, 255, 255, .34)",
      },
      sortFocus: {
        default: "#2aa198",
      },
    },
    "dark"
  );
  return (
    <DataTable columns={columns} data={data} pagination theme="solarized" />
  );
};
