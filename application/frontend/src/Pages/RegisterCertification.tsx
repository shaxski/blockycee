/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { CertificateType } from './Home';
import { postData } from './api';

type RegisterCertificationProps = { 
	dId: string; 
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
	setCertification: React.Dispatch<React.SetStateAction<CertificateType>>
} 

export default function RegisterCertification(props:RegisterCertificationProps) {
	const {dId, setOpenModal, setCertification} = props;
	
	const closeModal = () => setOpenModal(false);


	const registerCertification = (certifcationData: CertificateType) => postData("http://localhost:3000/recordCertification",certifcationData)
	.then((data) => {		
		setCertification(certifcationData)

		const blob = new Blob([data.privateKey], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = `${dId}.pem`;
		link.href = url;
		link.click();

		closeModal();
	}).catch((error) => {
		console.log(error);
	});


	const handleCertificationSubmit = (e: { preventDefault: () => void; target: any; }) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
		
    // Read the form data
    const form = e.target;				
    const formData = new FormData(form);
		
		const certifcationData = {
			DId: dId,
			CertifierId: formData.get('certificationId')!.toString(),
			CertificationId: formData.get('certificationId')!.toString(),
			CertificateType: formData.get('certificationType')!.toString(),
			IssueDate: formData.get('issueDate')!.toString(),
			ExpiryDate: formData.get('expiryDate')!.toString(),
		}
		registerCertification(certifcationData)
		console.log(certifcationData);
  }

	return (
		<div className='App-modal'>
			<h1 className='Certification-form'>Certification Form</h1>
			<hr />
			<form method="post"  onSubmit={handleCertificationSubmit} >
				<label className='Modal-label'>
					<h5 className='Modal-text'> Digital Id: </h5> 
					<input className='Modal-textField' type='text' name="did" defaultValue={dId} disabled/>
				</label>
				<label className='Modal-label' >
					<h5 className='Modal-text'>Certifier Id:</h5>
					<input className='Modal-textField' name="certifierId" type='text' required/>
				</label>
				<label className='Modal-label' >
					<h5 className='Modal-text'>Certification Id:</h5>
					<input className='Modal-textField' name="certificationId" type='text' required/>
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Certification Type:</h5>
					<div className='Modal-radio'>
					<input type="radio"  name="certificationType" value="Type A" required/>Type A
					<input type="radio"  name="certificationType" value="Type B" />Type B
					<input type="radio"  name="certificationType" value="Type C" />Type C
					</div>
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Issue Date:</h5>
					<input className='Modal-dateField' type='Date' name="issueDate" required/>
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Expiry Date:</h5>
					<input className='Modal-dateField' type='Date' name="expiryDate" required/>
				</label>
				<hr className='App-border'/>
				<button className='App-button Submit-button' type="submit"  value="Submit" >Submit Certification</button>
			</form>
			<button className='App-button Back-button' onClick={closeModal} >Close</button>
		</div>
	)
}
