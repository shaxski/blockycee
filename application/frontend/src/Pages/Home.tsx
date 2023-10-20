import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import RegisterCertification from './RegisterCertification';
import { postData } from './api';

export type CertificateType = {
	DId: string;
	CertifierId: string;
	IssueDate: string;
	CertificateType: string;
	ExpiryDate: string;
	PublicKey: string;
	CertificationId: string;
}

export default function Home() {
	const [uuid, setUuid] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [userId, setUserId] = useState<string>('')
	const [openModal, setOpenModal] = useState<boolean>(false)
	const [certification, setCertification] = useState<CertificateType>({
		"DId": '',
    "CertifierId": '',
    "IssueDate": "",
    "CertificateType": "",
    "ExpiryDate": "",
    "PublicKey": "",
    "CertificationId":"",
	})
  const navigate = useNavigate();

	const showModal = () => {
		setOpenModal(true)
	}

	const registerUser = (userId:string) => postData("http://localhost:3000/registerUser",{ orgName: "Org1MSP", userId: userId})
	.then((data) => {		
		setUuid(data.did)
		showModal()
	}).catch((error) => {
		console.log(error);
		setErrorMessage('Fail to register user')
	});

	const handleSubmit = async(e: { preventDefault: () => void }) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
		console.log('certification',certification);
		
		setErrorMessage('')	
		
		if (userId.length < 4) {
			setErrorMessage('Invalid User Id')
			return;
		}
		await registerUser(userId)
		
  }
	const handleChange= (e: { preventDefault: () => void; target: { value: React.SetStateAction<string>; }; })=>{
		e.preventDefault();
		
		setUserId(e.target.value)
	}
	const navigateToQRCode = () => navigate('/QRCode')
	
  return (
		<div className="App">
			{openModal && <RegisterCertification setOpenModal={setOpenModal} did={uuid} setCertification={setCertification}/>}
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
			<button onClick={showModal}>Open Modal</button>
		</div>
  );
}
