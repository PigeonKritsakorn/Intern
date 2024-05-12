import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Ranking from "./pages/Ranking";
// import Ranking from "./pages/Ranking";

import { Toaster } from "@/components/ui/toaster";

const App = () => {
  const authToken = localStorage.getItem("Login");
  const isLoginOrSignupPage = () => {
    const currentPath = window.location.pathname;
    return (
      currentPath === "/Login" ||
      currentPath === "/Signup" ||
      currentPath === "/ForgetPassword" ||
      currentPath === "/ResetPassword" ||
      currentPath === "/AdminLogin"
    );
  };

  return (
    <>
      {authToken ? (
        <>
          {!isLoginOrSignupPage() && <Navbar />}
          <Toaster />
          <Routes>
            <Route path="/" element={<Ranking />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
          </Routes>
        </>
      ) : (
        <>
          {!isLoginOrSignupPage() && <Navbar />}
          <Toaster />
          <Routes>
            <Route path="/" element={<Ranking />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default App;
