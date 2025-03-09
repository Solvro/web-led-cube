import { useAuth } from "../hooks/useAuth";
import { Outlet, useLocation, Link } from "react-router-dom";
import "./reqAuth.css";

export const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  const accessToken = localStorage.getItem("accessToken") || auth?.accessToken;

  return accessToken ? (
    <Outlet />
  ) : (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        className="reqauth-button"
      >
        <Link to="/login" state={{ from: location }} replace>
          Log in
        </Link>
      </button>
    </div>
  );
};
