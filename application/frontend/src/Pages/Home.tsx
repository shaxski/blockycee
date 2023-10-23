/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


export default function Home() {
	const [showAuth, setShowAuth] = useState(false)
	const navigate = useNavigate();
	const navigateToUser = () => {
		navigate('/user');
	};
	const navigateToAdmin = () =>{
		navigate('/admin');
	};

	const handleAuthSubmit = (e: { preventDefault: () => void; target: any; }) => {
		// Prevent the browser from reloading the page
		e.preventDefault();
		
		// Read the form data
		const form = e.target;				
		const formData = new FormData(form);
		const username = formData.get('username')!.toString();
		const password = formData.get('password')!.toString();
		
		
		if (username==="admin" && password==="password") {
			navigateToAdmin()
		}
	}
	const showAuthDialog =() => {
		setShowAuth(true)
	}
  return (
		<div className="App">
			{/* {openModal && <RegisterCertification setOpenModal={setOpenModal} dId={certification.DId} setCertification={setCertification} setPrivateKey={setPrivateKey}/>} */}
			<header>
				<h1>Welcome to Blockchain Beauty Organization</h1>
			</header>
			<div className="App-body">
				<div>
					{showAuth && (
						<div className='Auth-modal'>
							<form method="post"  onSubmit={handleAuthSubmit} >
								<label className='Modal-label'>
									<h5 className='Modal-text'>UserName</h5> 
									<input className='Modal-textField' type='text' name="username" />
								</label>
								<label className='Modal-label' >
									<h5 className='Modal-text'>Password</h5>
									<input className='Modal-textField' type="password" name='password' />
								</label>
								<hr className='App-border'/>
								<button className='App-button Ok-button' type="submit"  value="Submit" >Ok</button>
								<button className='App-button Back-button' onClick={()=>setShowAuth(false)}>Close</button>
							</form>
						</div>)
					}
					<button className='App-button User-button' onClick={navigateToUser}>User</button>
					<button className='App-button Admin-button' onClick={showAuthDialog}>Admin</button>
				</div>
			</div>
		</div>
  );
}
