export type CertificationRequest = {
	DId: string //unique
	CertifierId: string; // unique
	CertificationId: string; //unique
	CertificateType: 'Type A' | 'Type B' | 'Type C';
	IssueDate: string;
	ExpiryDate: string;
	PublicKey: string;
	[key:string]: string;
}