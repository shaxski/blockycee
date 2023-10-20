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
	const handleCertificationSubmit = async (e: { preventDefault: () => void; target: any; }) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;				
    const formData = new FormData(form);
		console.log(formData);
		
  }

	return (
		<div className='App-modal'>
			<form method="post" >
				<label className='Modal-label'>
					<h5 className='Modal-text'> Digital Id: </h5> 
					<input className='Modal-textField' name="userId" value={contract.DId} required/>
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Certification Id:</h5>
					<input className='Modal-textField' name="userId" defaultValue={contract.CertifierId} required/>
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Certification Type:</h5>
					<input className='Modal-radio' type="radio"  name="Type A" value="Type A" />Type A
					<input className='Modal-radio' type="radio"  name="Type B" value="Type B" />Type B
					<input className='Modal-radio' type="radio"  name="Type C" value="Type C" />Type C
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Issue Date:</h5>
					<input className='Modal-dateField' type='Date' name="userId" defaultValue="" required/>
				</label>
				<label className='Modal-label'>
					<h5 className='Modal-text'>Expiry Date:</h5>
					<input className='Modal-dateField' type='Date' name="userId" defaultValue="" required/>
				</label>
				<hr />
				<button type="submit" onSubmit={handleCertificationSubmit}>Submit Certification</button>
			</form>
			<button onClick={closeModal} >Close</button>
		</div>
	)
}
