// App.js
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
import RequireAuth from "./components/Auth/RequireAuth";
import Profile from "./pages/User/Profile";
import EditProfile from "./pages/User/EditProfile";
import ChangePassword from "./pages/User/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DisplayLecture from "./pages/Dashboard/DisplayLecture";
import AddLecture from "./pages/Dashboard/AddLecture";
import EditCourse from "./pages/Course/EditCourse";
import Settings from "./pages/Settings/Settings";
import TwoFactorAuthentication from "./pages/Settings/TwoFactorAuthentication";

function App() {
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const tfaPending = useSelector((state) => state?.auth?.tfaPending);
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
        <Route path="/login/two-factor-auth" element={(!isLoggedIn && tfaPending) ? <TwoFactorAuthentication /> : <Navigate to="/login" />} />
        <Route path="/forgetpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* Protected Routes for ADMIN */}
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
          <Route path="/course/addlecture" element={<AddLecture />} />
          <Route path="/course/editcourse" element={<EditCourse />} />
        </Route>

        {/* Protected Routes for ADMIN and USER */}
        <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/editprofile" element={<EditProfile />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/course/displaylectures" element={<DisplayLecture />} />
          <Route path="/user/setting" element={<Settings />} />
        </Route>

        {/* General Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course/description" element={<CourseInfo />} />
        <Route path="/denied" element={<Denied />} />

        {/* Fallback Route */}
        <Route path="*" element={<ErrorNotFound />} />
      </Routes>
    </>
  );
}

export default App;
