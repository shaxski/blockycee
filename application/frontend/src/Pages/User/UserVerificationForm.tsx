/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { postData } from '../api';
import { CertificateType } from '../../models';

type UserVerificationFormProps = { 
	certification: CertificateType; 
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
	setCertification:  React.Dispatch<React.SetStateAction<CertificateType>>
} 

export default function UserVerificationForm(props:UserVerificationFormProps) {
	const {certification, setOpenModal, setCertification} = props;
	const [submitMessage, setSubmitMessage] = useState('');
	const closeModal = () => setOpenModal(false);

	setCertification(certification);
	const verifyCertification = async (verify:boolean, certification: CertificateType) => postData("http://localhost:3000/verifyCertificationByUser",{verify:verify, id:certification.DId})
	.then((data) => {		
		console.log(data);
		const blob = new Blob([data.privateKey], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = `${certification.DId}.pem`;
		link.href = url;
		link.click();
	}).catch((error) => {
		console.log(error);
		setSubmitMessage('')
	});


	const handleCertificationSubmit = async (e: { preventDefault: () => void; target: any; }) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
		
    // Read the form data
		try {
			await verifyCertification(true,certification)
			setSubmitMessage(`Certification has been successfully verified for ${certification.DId}`)
			closeModal();
		} catch (error) {
			setSubmitMessage('')
		}
		
  }
	const rejectCertification = () => {
		verifyCertification(false,certification)
		closeModal()
	}

	return (
		<div className='App-modal'>
			<h1 className='Certification-form'>Certification Form</h1>
			<hr />
			{submitMessage.length>0 && (
					<div className='Message-container '>
						<p className='Message-text'> {submitMessage}</p>
					</div>
					)}
			<form method="post"  onSubmit={handleCertificationSubmit} >
				<label className='Modal-label'>
					<h5 className='Modal-text'> Digital Id: </h5> 
					<input className='Modal-textField' type='text' name="did" defaultValue={certification.DId} disabled/>
				</label>
				<label className='Modal-label' >
					<h5 className='Modal-text'>Certifier Id:</h5>
					<input className='Modal-textField' name="certifierId" defaultValue={certification.CertifierId}  type='text' required/>
				</label>
				<label className='Modal-label' >
					<h5 className='Modal-text'>Certification Id:</h5>
					<input className='Modal-textField' name="certificationId" defaultValue={certification.CertificationId}  type='text' required/>
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Certification Type:</h5>
					<input className='Modal-textField' name="certificationType" defaultValue={certification.CertificateType}  type='text' required/>
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Issue Date:</h5>
					<input className='Modal-dateField' type='Date' defaultValue={certification.IssueDate}  name="issueDate" required/>
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Expiry Date:</h5>
					<input className='Modal-dateField' type='Date'  defaultValue={certification.ExpiryDate} name="expiryDate" required/>
				</label>
				<hr className='App-border'/>
				<button className='App-button Approved-button' type="submit"  value="Submit" >Approved</button>
				<button className='App-button Back-button' onClick={rejectCertification} >Reject</button>
			</form>
	
		</div>
	)
}
