import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import ErrorNotFound from "./pages/ErrorNotFound"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/> 
      <Route path="/about" element={<About/>}/> 
      <Route path="/contact" element={<Contact/>}/> 
      <Route path="*" element={<ErrorNotFound/>}/> 
      <Route path="/signup" element={<Signup/>}/> 
      <Route path="/login" element={<Login/>}/> 

    </Routes>
    </>
  )
}

export default App
