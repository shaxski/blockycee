/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import RegisterCertification from './RegisterCertification';


export default function Home() {
	const [uuid, setUuid] = useState<string>('');
	const [error, setError] = useState<boolean>(false)
	const [openModal, setOpenModal] = useState<boolean>(false)
  const navigate = useNavigate();

	async function postData(url = "", data = {}) {
		// Default options are marked with *
		try {
			const response = await fetch(url, {
				method: "POST", 
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				throw new Error(`Error ${response}`);
			}
			return response.json(); 
		} catch (error) {
			throw new Error("Fail to registerUser");
		}
	}

	const showModal = () => {
		setOpenModal(true)
	}

	const registerUser = (userId:string) => postData("http://localhost:3000/registerUser",{ orgName: "Org1MSP", userId: userId})
	.then((data) => {		
		setUuid(data.did)
		showModal()
	}).catch((error) => {
		console.log(error);
		setError(true)
	});

	async function handleSubmit(e: { preventDefault: () => void; target: any; }) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;				
    const formData = new FormData(form);
		
		setError(false)	
		registerUser(formData.get('userId')?.toString() ?? 'User')
		
  }
	const navigateToQRCode = () => navigate('/QRCode')

  return (
		<div className="App">
			{error && (
				<p className='Error-Message'>Error occurred</p>
			)}
			{openModal && <RegisterCertification setOpenModal={setOpenModal} did={uuid}/>}
			<header>
				<h1>Welcome to Blockchain Beauty Organization</h1>
			</header>
			<body className="App-header">
				<form method="post" onSubmit={handleSubmit}>
					<label>
						<h5>
							User Id: <input name="userId" defaultValue="Register with user Id" />
						</h5>
					</label>
					<hr />
					<button type="submit">Register</button>
					<button onClick={navigateToQRCode}>Open QRCode</button>
					<button onClick={showModal}>Open Modal</button>
				</form>
			</body>
		</div>
  );
}
