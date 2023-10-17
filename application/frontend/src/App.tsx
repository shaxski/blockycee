import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/HomePage';
import QrCode from './Pages/QRPage';
import Header from './Layout/Header';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/qrcode" element={<QrCode />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
  // return (
    
  //   <QR />
  // );
}

export default App;
