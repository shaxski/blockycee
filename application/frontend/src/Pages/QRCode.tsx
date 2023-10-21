import React from 'react'
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function QrCode() {
	const { state } = useLocation();

	console.log('state QR', state.encryptData);
	console.log(state.certification.DId);
	
	const navigate = useNavigate();
	// This need to pass as props
	const qrText = JSON.stringify({
		"DId": state.certification.DId,
		"SignedData": state.encryptData
	});

	const home = () => navigate('/', {state:{...state.certification}});

	return (
		<div className="App">
			<header>
				<h1>QR Code</h1>
			</header>
			<div className="App-body">
				<QRCodeSVG value={qrText} size={400}/>
				<button className={"App-button Back-button"} onClick={home}>Back</button>
			</div>
		</div>
	);
}
