import  { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import NotFound from './components/NotFound';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPasswordScreen from './components/ForgotPassword';
import VerifyOtpScreen from './components/VerifyOtp';
import CreateNewPasswordScreen from './components/CreateNewPassword';
import ProtectedRoute from './utils/ProtectedRoute';
import { ToastError, ToastSuccess } from './utils/toastify';
import useAuth from './utils/useAuth';

function App () {
    // useAuth();
    useEffect(() => {
      window.addEventListener("online", () => ToastSuccess("Back to online"));
      window.addEventListener("offline", () =>
        ToastError("Oops! No Internet")
      );
    }, []);
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reg" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/forgot" element={<ForgotPasswordScreen />} />
        <Route path="/verifyOTP" element={<VerifyOtpScreen />} />
        <Route path="/createPassword" element={<CreateNewPasswordScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
