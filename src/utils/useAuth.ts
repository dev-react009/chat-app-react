import  { useCallback, useEffect } from 'react'
import useCustomNavigate from './navigate'
import Cookies from 'js-cookie';
import { ToastError } from './toastify';

const useAuth = () => {

const {navigateTo} = useCustomNavigate();
 
  const checkToken = useCallback(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigateTo("/");
      return;
    }
    try {
      const [,payload] = token.split(".");
      const decodePayload = JSON.parse(atob(payload));
      const expirationTime = new Date(decodePayload.exp * 1000);
      if (new Date() > expirationTime) {
        Cookies.remove("token");
        navigateTo("/");
      ToastError("Token Expired");
      }
    } catch (err: any) {
      console.error("Error decoding token:", err.message);
      Cookies.remove("token");
      navigateTo("/");
      ToastError("Token Expired")
    }
  },[navigateTo]);

   useEffect(() => {
     checkToken();
   }, [navigateTo, checkToken]);
}

export default useAuth
