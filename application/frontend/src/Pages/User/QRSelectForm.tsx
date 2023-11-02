/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { postData } from '../api';


type QRSelectFormProps = { 
	dId: string; 
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
	setQrCodeData: React.Dispatch<React.SetStateAction<string>>;
	data: any;
} 

export default function QRSelectForm(props:QRSelectFormProps) {
	const {dId, setOpenModal, data,setQrCodeData} = props;
	const closeModal = () => setOpenModal(false);



	const handleCertificationSubmit = async (e: { preventDefault: () => void; target: any; }) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
		
    // Read the form data
    const form = e.target;				
    const formData = new FormData(form);
		

		const certificationData = {
			"CertifierId": formData.get('CertifierId')?.toString(),
			"CertificationId": formData.get('CertificationId')?.toString(),
			"CertificateType": formData.get('CertificateType')?.toString(),
			"IssueDate": formData.get('IssueDate')?.toString(),
			"ExpiryDate": formData.get('ExpiryDate')?.toString(),
		}

		Object.keys(certificationData).forEach((key:string) => certificationData[key as keyof typeof certificationData] === undefined && delete certificationData[key as keyof typeof certificationData])

		
		const value = await postData("http://localhost:3000/generateSignedData",{ DId: dId, SignedData: certificationData})

		const qrValue = JSON.stringify({
			"DId": dId,
			"SignedData": value.encryptData
		});
		
		setQrCodeData(qrValue)
		closeModal();
  }

	return (
		<div className='QR-modal'>
			<h1 className='Certification-form'>Create QR Code</h1>
			<hr />
			<form method="post"  onSubmit={handleCertificationSubmit} >
				<label className='Modal-label'>
					<h5 className='Modal-text'> Digital Id:</h5> 
					<div className='Modal-radio'>
						<input type="checkbox" name="did" defaultValue={dId} />{dId}
					</div>
				</label>
				<label className='Modal-label' >
					<h5 className='Modal-text'>Certifier Id:</h5>
					<div className='Modal-radio'>
						<input type="checkbox" name="CertifierId" defaultValue={data.CertifierId} />{data.CertifierId}
					</div>
				</label>
				<label className='Modal-label' >
					<h5 className='Modal-text'>Certification Id:</h5>
					<div className='Modal-radio'>
						<input type="checkbox" name="CertificationId" defaultValue={data.CertificationId}  />{data.CertificationId}
					</div>
				
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Certification Type:</h5>
					<div className='Modal-radio'>
						<input type="checkbox" name="CertificateType" defaultValue={data.CertificateType} />{data.CertificateType}
					</div>
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Issue Date:</h5>
					<div className='Modal-radio'>
						<input type="checkbox" name="IssueDate" defaultValue={data.IssueDate} />{data.IssueDate}
					</div>
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Expiry Date:</h5>
					<div className='Modal-radio'>
						<input type="checkbox" name="ExpiryDate" defaultValue={data.ExpiryDate} />{data.ExpiryDate}
					</div>
				</label>
				<hr className='App-border'/>
				<button className='App-button Submit-button' type="submit"  value="Submit" >Create QR</button>
				<button className='App-button Back-button' onClick={closeModal} >Close</button>
			</form>
		</div>
	)
}
