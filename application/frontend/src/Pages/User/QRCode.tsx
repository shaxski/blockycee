import React, {  useState } from 'react'
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import QRSelectForm from './QRSelectForm';

export default function QRCode() {
	const { state } = useLocation();
	const [openModal, setOpenModal] = useState(false);
	const [qrCodeData, setQrCodeData] = useState(JSON.stringify({
		"DId": state.certification.DId,
		"SignedData": state.encryptData
	}));


	console.log('QR encryptData: ', JSON.parse(qrCodeData));


	const navigate = useNavigate();


	const home = () => navigate('/user', {state:{...state.certification}});
	const qrForm = () => setOpenModal(true);

	return (
		<div className="App">
			<header>
				<h1>QR Code</h1>
			</header>
			{ openModal && (
				<div>
					<QRSelectForm dId={state.certification.DId} data={state.certification} setOpenModal={setOpenModal} setQrCodeData={setQrCodeData}/>
				</div>
				)}
			<div className="App-body">
				<QRCodeSVG value={qrCodeData} size={400}/>
				<button className={"App-button QR-Back-button"} onClick={home}>Back</button>
				<button className={"App-button QR-Back-button"} onClick={qrForm}>Generate QR</button>
			</div>

		
		</div>
	);
}
