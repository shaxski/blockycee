import React from 'react'
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import { JSEncrypt } from "jsencrypt";

const encrypt = new JSEncrypt();

export default function QrCode() {
	const { state } = useLocation();
	

	const tryKey = async() => {

		console.log('asdf',state);

		encrypt.setPrivateKey(state.privateKey)
		const encrypted = encrypt.encrypt(JSON.stringify(state.certification));
		console.log(encrypted);
		


	}
	tryKey()
	// console.log('state QR',state);
	const navigate = useNavigate();
	// This need to pass as props
	const qrText = JSON.stringify({
		"CertificationId": "ProCertId-Kai1",
		"SignedData": "Sq9tIVqs65kl8ywFL9VUX54j+DO3JCspnot/wgpUpiNLZyy+q6nazH2eD03b4sB7fMV8UcYVAavvL0I4Qib3+7Cl72J0M89wjQMtlNo4Ylt7kcgfD1Nm3sdMsvABmRy4SwgwMOKo8pFYMM1gbCOtIhn2JANYTmO1UQNCG4R79UVpRG1lEYHksnXWEYNXK9Vz5jSVOjCq018w31rHBscJTvnSCL5toMkttp+qg601jbD4OnEIntW6S4A++sFjEVls+ShJfms40XT1KgnnWpZg7YJ+jQUXAmfsHzeR4YASLf+Ym6g98boE6qGuy//g9EK75rXiHEZMPsNIQZDtCXxeSw=="
	});

	const home = () => navigate('/', {state:{...state}});

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
