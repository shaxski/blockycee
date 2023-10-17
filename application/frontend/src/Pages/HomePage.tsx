import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
	return (
		<div className="App">
			<header className="App-header">
			<div>Link to QR Code Page</div>
				<Link to="/qrcode">Click here</Link>
			</header>
		</div>
		
	)
}
