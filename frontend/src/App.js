import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";

import "./App.css";
import {LoginPage, SignupPage, ActivationPage} from "./Routes.js";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/activation/:activation_token" element={<ActivationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;