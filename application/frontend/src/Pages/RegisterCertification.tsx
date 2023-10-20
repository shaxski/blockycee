/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

type RegisterCertificationProps = { 
	did: string; 
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>; 
} 

export default function RegisterCertification(props:RegisterCertificationProps) {
	const {did, setOpenModal} = props;
	console.log(did);
	
	const closeModal = () => setOpenModal(false);
	const contract = {
    "DId": "whsonvm5XMTmiCq4RzCyzi",
    "CertifierId": "Organization AUT",
    "IssueDate": "2023-10-03T12:00:00.000Z",
    "CertificateType": "Type A",
    "ExpiryDate": "2025-10-03T12:00:00.000Z",
    "PublicKey": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF5SFd1RmZHMEt0T3BtZnkxMnVWbQo3bjdYMG1DVlFyY0EzYzU4SnUrZ1p1bmdpa1dOd0lZZkNNQUpMMjF2bHJRV3dXMUVBcnU5QlZ6Sy9aWUkxTUNpCm1FdHZTZnNUZ0dNcTN3MzZOVkNDR204RWY4NTlKY1JJTEU2QmIzY0w2NVc0MW5jNG5YOTBwd24yL1VyNGlCMzAKQW5BNDNuTHJtRkhBYWRja2E5UUxEK2REZ3ZWUEMvN25qaTA5MEI0NFVDaklrVWJIS25FVTF5TitzcVVSZFBQNApzcTh6TFhqb2VLaENRb0ttR1FhSktRdU1ZUEJxMUFVOTNqRHhMbHFHS29MMloxU21lMC9tRGdNcUZ6MThQOVJlCnBXbXRNdDRiNDUxWXNSQksrR3pidFJHN0dHcHpZMEdTTmxwRHdIRm5Ec0VVNUd3WlVBelo2eFQ5dlRsVlhuRmsKblFJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==",
    "CertificationId": "ProCertId-Kai1"
	};

	const handleCertificationSubmit = (e: { preventDefault: () => void; target: any; }) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
		
    // Read the form data
    const form = e.target;				
    const formData = new FormData(form);
		
		const certifcationData = {
			DId: contract.DId,
			CertifierId: formData.get('certificationId'),
			CertificateType: formData.get('certificationType'),
			IssueDate: formData.get('issueDate'),
			ExpiryDate: formData.get('expiryDate')
		}
		console.log(certifcationData);
		
  }

	return (
		<div className='App-modal'>
			<h1 className='Certification-form'>Certification Form</h1>
			<hr />
			<form method="post"  onSubmit={handleCertificationSubmit} >
				<label className='Modal-label'>
					<h5 className='Modal-text'> Digital Id: </h5> 
					<input className='Modal-textField' type='text' name="did" defaultValue={contract.DId} disabled/>
				</label>
				<label className='Modal-label' >
					<h5 className='Modal-text'>Certification Id:</h5>
					<input className='Modal-textField' name="certificationId" type='text' defaultValue={contract.CertifierId} required/>
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
