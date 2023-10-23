import React, {  useState } from 'react'
import { postData } from '../api';
import RegisterCertification from './RegisterCertificationForm';

export default function Admin() {

	const [userId, setUserId] = useState<string>('');
	const [dId, setDId] = useState<string>('')
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [openModal, setOpenModal] = useState<boolean>(false);

	const showModal = () => {
		setOpenModal(true)
	};

	const registerUser = (userId:string) => postData("http://localhost:3000/createUserByAdmin",{ status: "true", userId: userId})
	.then((data) => {		
		console.log(data);
		
		setDId(data.did)
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
	
  return (
		<div className="App">
			{openModal && <RegisterCertification setOpenModal={setOpenModal} dId={dId}/>}
			<header>
				<h1>Welcome to Blockchain Beauty Organization Admin Page</h1>
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
					<button className='App-button Submit-button' onClick={handleSubmit}>Register UserId</button>
				</div>
			</div>
		</div>
  );
}
