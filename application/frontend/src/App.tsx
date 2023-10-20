import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import QrCode from './Pages/QRCode';


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/qrcode" element={<QrCode />} />
      </Routes>
    </BrowserRouter>
  );
  // return (
    
  //   <QR />
  // );
}

export default App;
