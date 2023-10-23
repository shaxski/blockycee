import React from 'react'
import { useNavigate } from 'react-router-dom';


export default function Home() {
	const navigate = useNavigate();
	const navigateToUser = () => {
		navigate('/user');
	};
	const navigateToAdmin = () =>{
		navigate('/admin');
	};

  return (
		<div className="App">
			{/* {openModal && <RegisterCertification setOpenModal={setOpenModal} dId={certification.DId} setCertification={setCertification} setPrivateKey={setPrivateKey}/>} */}
			<header>
				<h1>Welcome to Blockchain Beauty Organization</h1>
			</header>
			<div className="App-body">
				<div>
					<button className='App-button User-button' onClick={navigateToUser}>User</button>
					<button className='App-button Admin-button' onClick={navigateToAdmin}>Admin</button>
				</div>
			</div>
		</div>
  );
}
