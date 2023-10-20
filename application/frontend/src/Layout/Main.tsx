import React from 'react'
import { Outlet } from "react-router-dom";
import Footer from './Footer';

export default function Main() {
	return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}
