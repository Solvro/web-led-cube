import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {Outlet, useLocation, Link } from "react-router-dom";

export const RequireAuth = () => {
    const { auth } = useAuth();  // Get auth state from the useAuth hook
    const location = useLocation();
    
    useEffect(() => {
        console.log(auth?.access);
      }, []);

    return (
        auth?.access
            ? <Outlet />  // If there's an access token, render the protected route
            : (
                <div>
                    <button>
                        <Link to="/login" state={{ from: location }}>
                            Log in
                        </Link>
                    </button>
                </div>  // Otherwise, show the "Log in" button
            )
    );
}