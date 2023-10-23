import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import QrCode from './Pages/QRCode';
import Main from './Layout/Main';
import Admin from './Pages/Admin/Admin';
import User from './Pages/User/User';


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="/qrcode" element={<QrCode />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
