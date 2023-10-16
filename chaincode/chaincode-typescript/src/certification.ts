
import {Object, Property} from 'fabric-contract-api';

@Object()
export class Certification {
  @Property()
  public PublicKey: string;
	@Property()
  public CertifierId: string; // unique Company or Organization ID
  @Property()
  public CertificationId: string; //unique User Certification ID
	@Property()
  public IssueDate: string;
	@Property()
  public CertificateType: 'Type A' | 'Type B' | 'Type C';
	@Property()
  public ExpiryDate: string;
}