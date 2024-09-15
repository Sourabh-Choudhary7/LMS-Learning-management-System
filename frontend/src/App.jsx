import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ErrorNotFound from "./pages/ErrorNotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const navigate = useNavigate();

  // Redirect to home if logged in and trying to access login/signup
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<ErrorNotFound />} />
        {
          !isLoggedIn &&
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </>
        }
      </Routes>
    </>
  );
}

export default App;
