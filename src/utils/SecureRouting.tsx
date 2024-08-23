
import React from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const SecureRouting = (OriginalComponent: React.FC) => {
  const safeRoute = () => {
    let getToken = Cookies.get("token");
    if (getToken === undefined) {
      return <OriginalComponent />;
    } else {
      return <Navigate to={"/dashboard"} />;
    }
  };
  return safeRoute;
};


export default SecureRouting;
