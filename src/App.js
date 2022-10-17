import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import File404 from "./components/File404";
import Home from "./components/Home";
import Weather from "./components/Weather";

function App() {
  return (
    <>
      <Router>
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/weather" element={<Weather />} />
            <Route exact path="/:id" element={<File404 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;