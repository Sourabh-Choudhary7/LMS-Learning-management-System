import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ErrorNotFound from "./pages/ErrorNotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CourseList from "./pages/Course/CourseList";
import CourseInfo from "./pages/Course/CourseInfo";
import CreateCourse from "./pages/Course/CreateCourse";
import Denied from "./pages/Denied";
import RequireAuth from "./components/Auth/RequireAuth"
import Profile from "./pages/User/Profile";


function App() {
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  return (
    <>
      <Routes>
        <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course/description" element={<CourseInfo />} />

        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
          <Route path="/user/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<ErrorNotFound />} />
        <Route path="/denied" element={<Denied />} />

      </Routes>
    </>
  );
}

export default App;
