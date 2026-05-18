import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RestrictedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default RestrictedRoute;