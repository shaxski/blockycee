/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import {  useLocation, useNavigate} from 'react-router-dom';
import { CertificateType } from '../../models';
import { getData, postData } from '../api';
import UserVerificationForm from './UserVerificationForm';

const initCertification = {
	"DId": '',
	"CertifierId": '',
	"IssueDate": "",
	"CertificateType": "",
	"ExpiryDate": "",
	"CertificationId": "",
}

export default function User() {

	const [errorMessage, setErrorMessage] = useState<string>('');
	const [userId, setUserId] = useState<string>('');
	const [dId, setDId] = useState('');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [certification, setCertification] = useState<CertificateType>(initCertification);
	
	const { state } = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {		
		console.log(state);
		
		if (state) {
			setCertification(state);
		}
		return () => {
			setCertification(initCertification)
		}
	}, [state]);
	

	const showModal = () => {
		
		setOpenModal(true)
	};

	const getCertification = (dId: string,userId:string) => getData("http://localhost:3000/certification",{ dId: dId, userId: userId})
	.then((data: any) => {		
		setCertification(data)
		showModal()
	}).catch((error: any) => {
		console.log(error);
		setErrorMessage('Fail to register user')
	});

	const handleSubmit = async(e: { preventDefault: () => void }) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
				
		setErrorMessage('')	
		
		if (userId && dId && userId.length < 3) {
			setErrorMessage('Invalid User Id')
			return;
		}
		await getCertification(dId, userId)

  };
	const handleUserIdChange= (e: { preventDefault: () => void; target: { value: React.SetStateAction<string>; }; })=>{
		e.preventDefault();
		
		setUserId(e.target.value)
	};
	const handleDIdChange= (e: { preventDefault: () => void; target: { value: React.SetStateAction<string>; }; })=>{
		e.preventDefault();
		
		setDId(e.target.value)
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
			{openModal && <UserVerificationForm setOpenModal={setOpenModal} certification={certification} />}
			<header>
				<h1>Welcome to Blockchain Beauty Organization</h1>
			</header>
			<div className="App-body">
				<div>
					<label>
						<h5>
							User Id: <input className='App-textField' name="userId" value={userId} onChange={handleUserIdChange} required/>
						</h5>
					</label>
					<label>
						<h5>
							Digital Id: <input className='App-textField' name="dId" value={dId} onChange={handleDIdChange} required/>
						</h5>
					</label>
					<hr />
					{errorMessage.length>0 && (
					<div className='Message-container '>
						<p className='Message-text'> {errorMessage}</p>
					</div>
					)}
					<button className='App-button Submit-button' onClick={handleSubmit}>Get Certification</button>
					<button className='App-button QR-button' onClick={navigateToQRCode}>QR Code</button>
				</div>
			</div>
		</div>
  );
}


