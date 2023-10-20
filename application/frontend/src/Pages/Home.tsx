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
		setCertification({...certification, DId: data.did})

		showModal()
	}).catch((error) => {
		console.log(error);
		setErrorMessage('Fail to register user')
	});

	const handleSubmit = async(e: { preventDefault: () => void }) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

		//TODO: sample data. !This need to be removed
		const contract = {
			"DId": "whsonvm5XMTmiCq4RzCyzi",
			"CertifierId": "Organization AUT",
			"IssueDate": "2023-10-03T12:00:00.000Z",
			"CertificateType": "Type A",
			"ExpiryDate": "2025-10-03T12:00:00.000Z",
			"PublicKey": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF5SFd1RmZHMEt0T3BtZnkxMnVWbQo3bjdYMG1DVlFyY0EzYzU4SnUrZ1p1bmdpa1dOd0lZZkNNQUpMMjF2bHJRV3dXMUVBcnU5QlZ6Sy9aWUkxTUNpCm1FdHZTZnNUZ0dNcTN3MzZOVkNDR204RWY4NTlKY1JJTEU2QmIzY0w2NVc0MW5jNG5YOTBwd24yL1VyNGlCMzAKQW5BNDNuTHJtRkhBYWRja2E5UUxEK2REZ3ZWUEMvN25qaTA5MEI0NFVDaklrVWJIS25FVTF5TitzcVVSZFBQNApzcTh6TFhqb2VLaENRb0ttR1FhSktRdU1ZUEJxMUFVOTNqRHhMbHFHS29MMloxU21lMC9tRGdNcUZ6MThQOVJlCnBXbXRNdDRiNDUxWXNSQksrR3pidFJHN0dHcHpZMEdTTmxwRHdIRm5Ec0VVNUd3WlVBelo2eFQ5dlRsVlhuRmsKblFJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==",
			"CertificationId": "ProCertId-Kai1"
		};
		setCertification(contract)
				
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
			{openModal && <RegisterCertification setOpenModal={setOpenModal} dId={certification.DId} setCertification={setCertification}/>}
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
