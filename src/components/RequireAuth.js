import { useAuth } from "../hooks/useAuth";
import {Outlet, useLocation, Link } from "react-router-dom";

const RequireAuth = () => {
    const { auth } = useAuth();  // Get auth state from the useAuth hook
    const location = useLocation();

    // Check if the access token is available in localStorage (persistent login)
    const accessToken = localStorage.getItem("accessToken") || auth?.accessToken;

    return (
        accessToken
            ? <Outlet />  // If there's an access token, render the protected route
            : (
                <div>
                    <button>
                        <Link to="/login" state={{ from: location }} replace>
                            Log in
                        </Link>
                    </button>
                </div>  // Otherwise, show the "Log in" button
            )
    );
}

export default RequireAuth;