export type CertificationRequest = {
	CertifierId: string; // unique
	CertificationId: string; //unique
	IssueDate: string;
	CertificateType: 'Type A' | 'Type B' | 'Type C';
	ExpiryDate: string;
	[key:string]: string;
}