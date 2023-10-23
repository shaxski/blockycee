import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import QRCode from './Pages/User/QRCode';
import Main from './Layout/Main';
import Admin from './Pages/Admin/Admin';
import User from './Pages/User/User';


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="/user" element={<User />} />
            <Route path="/qrcode" element={<QRCode />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
