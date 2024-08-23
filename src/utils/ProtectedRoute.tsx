import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import { ToastError } from "./toastify";

const ProtectedRoute: React.FC = () => {
  const token = Cookies.get("token");

  if (!token) {
    ToastError("Token expired");
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;


