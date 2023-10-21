import React, { useEffect, useState } from 'react'
import {  useLocation, useNavigate} from 'react-router-dom';
import RegisterCertification from './RegisterCertification';
import { postData } from './api';

export type CertificateType = {
	DId: string;
	CertifierId: string;
	IssueDate: string;
	CertificateType: string;
	ExpiryDate: string;
	CertificationId: string;
}

const initCertification = {
	"DId": '',
	"CertifierId": '',
	"IssueDate": "",
	"CertificateType": "",
	"ExpiryDate": "",
	"CertificationId": "",
}

export default function Home() {

	const [errorMessage, setErrorMessage] = useState<string>('');
	const [userId, setUserId] = useState<string>('');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [certification, setCertification] = useState<CertificateType>(initCertification);
  const [privateKey, setPrivateKey] = useState<string>('');
	
	const { state } = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {		
		console.log(privateKey);

		if (state) {
			
			setCertification(state);
			// setPrivateKey(state.privateKey)
		}
		return () => {
			setCertification(initCertification)
			setPrivateKey('')
		}
	}, [state]);
	

	const showModal = () => {
		
		setOpenModal(true)
	};

	const registerUser = (userId:string) => postData("http://localhost:3000/registerUser",{ orgName: "Org1MSP", userId: userId})
	.then((data) => {		
		setCertification({...certification, DId: data.did})

		showModal()
	}).catch((error) => {
		console.log(error);
		setErrorMessage('Fail to register user')
	});

	const handleSubmit = async(e: { preventDefault: () => void }) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
				
		setErrorMessage('')	
		
		if (userId.length < 4) {
			setErrorMessage('Invalid User Id')
			return;
		}
		await registerUser(userId)

  };
	const handleChange= (e: { preventDefault: () => void; target: { value: React.SetStateAction<string>; }; })=>{
		e.preventDefault();
		
		setUserId(e.target.value)
	};
	
	const navigateToQRCode = async() => {
		
		if (certification.DId || certification.DId.length) {
			const value = await postData("http://localhost:3000/generateSignedData",{ DId: certification.DId, SignedData: certification})

			const qrCodeData = {
				encryptData:value.encryptData,
				certification: certification
			};
			
			navigate('/QRCode', {state: qrCodeData});
		}
		setErrorMessage('Missing Digital Id. Please Create one');
	};
	
  return (
		<div className="App">
			{openModal && <RegisterCertification setOpenModal={setOpenModal} dId={certification.DId} setCertification={setCertification} setPrivateKey={setPrivateKey}/>}
			<header>
				<h1>Welcome to Blockchain Beauty Organization</h1>
			</header>
			<div className="App-body">
				<div>
					<label>
						<h5>
							User Id: <input className='App-textField' name="userId" value={userId} onChange={handleChange} required/>
						</h5>
					</label>
					<hr />
					{errorMessage.length>0 && (
					<div className='Message-container '>
						<p className='Message-text'> {errorMessage}</p>
					</div>
					)}
					<button className='App-button Submit-button' onClick={handleSubmit}>Register</button>
					<button className='App-button QR-button' onClick={navigateToQRCode}>QR Code</button>
				</div>
			</div>
		</div>
  );
}
