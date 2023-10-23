import React from 'react'
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function QRCode() {
	const { state } = useLocation();

	console.log('QR encryptData: ', state.encryptData);
	console.log('QR DId: ', state.certification.DId);
	
	const navigate = useNavigate();
	// This need to pass as props
	const qrText = JSON.stringify({
		"DId": state.certification.DId,
		"SignedData": state.encryptData
	});

	const home = () => navigate('/user', {state:{...state.certification}});

	return (
		<div className="App">
			<header>
				<h1>QR Code</h1>
			</header>
			<div className="App-body">
				<QRCodeSVG value={qrText} size={400}/>
				<button className={"App-button QR-Back-button"} onClick={home}>Back</button>
			</div>
		</div>
	);
}
