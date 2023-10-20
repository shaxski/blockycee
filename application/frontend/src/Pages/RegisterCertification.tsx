import React from 'react'

type RegisterCertificationProps = { 
	did: string; 
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>; 
} 

export default function RegisterCertification(props:RegisterCertificationProps) {
	const {did, setOpenModal} = props
	
	const closeModal = () => setOpenModal(false)
	return (
		<div className='App-modal'>
			<form method="post" >
					<label>
						<h4> Digital Id: </h4> <p>{did}</p>
					</label>
					<hr />
					<button type="submit">Submit Certification</button>
				</form>
			<button onClick={closeModal}>Close</button>
		</div>
	)
}
