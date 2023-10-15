
import {Object, Property} from 'fabric-contract-api';

@Object()
export class Certification {
  @Property()
  public PublicKey?: string;
	@Property()
  public CertifierId: string; // unique
  @Property()
  public CertificationId: string; //unique
	@Property()
  public IssueDate: string;
	@Property()
  public CertificateType: 'Type A' | 'Type B' | 'Type C';
	@Property()
  public ExpiryDate: string;
}