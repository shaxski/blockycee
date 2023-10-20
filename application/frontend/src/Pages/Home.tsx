/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import RegisterCertification from './RegisterCertification';
import { postData } from './api';


export default function Home() {
	const [uuid, setUuid] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [userId, setUserId] = useState<string>('')
	const [openModal, setOpenModal] = useState<boolean>(false)
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

	async function handleSubmit(e: { preventDefault: () => void; target: any; }) {
    // Prevent the browser from reloading the page
    e.preventDefault();

		setErrorMessage('')	
		console.log(userId.length);
		
		if (userId.length < 4) {
			setErrorMessage('Invalid User Id')
			return;
		}
		registerUser(userId)
		
  }
	const handleChange= (e: { preventDefault: () => void; target: { value: React.SetStateAction<string>; }; })=>{
		e.preventDefault();
		
		setUserId(e.target.value)
	}
	const navigateToQRCode = () => navigate('/QRCode')
	
  return (
		<div className="App">
			{openModal && <RegisterCertification setOpenModal={setOpenModal} did={uuid}/>}
			<header>
				<h1>Welcome to Blockchain Beauty Organization</h1>
			</header>
			<body className="App-body">
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
					{/* <button onClick={showModal}>Open Modal</button> */}
			</body>
		</div>
  );
}
