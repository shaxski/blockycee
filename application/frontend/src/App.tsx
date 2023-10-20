import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import QrCode from './Pages/QRCode';
import Main from './Layout/Main';


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="/qrcode" element={<QrCode />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
