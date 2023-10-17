import React from 'react'
import { Outlet, Link } from "react-router-dom";

export default function Header() {
	return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/qrcode">QR Code</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
}
