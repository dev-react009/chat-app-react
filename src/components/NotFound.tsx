import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const token = Cookies.get("token");
  const navigate = useNavigate();

  if (!token) {
    setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
    return <div>Page not found. Redirecting to login...</div>;
  }
  return <div>Page not found</div>;
};

export default NotFound;
