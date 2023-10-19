
import {Object, Property} from 'fabric-contract-api';

@Object()
export class Certification {
  @Property()
  public PublicKey?: string;
  @Property()
  public DId: string; // short uuid
	@Property()
  public CertifierId: string; // unique Company or Organization ID
  @Property()
  public CertificationId: string; // Certification ID ex. Driver Licence, Student ID
	@Property()
  public CertificateType: 'Type A' | 'Type B' | 'Type C';
	@Property()
  public IssueDate: string;
	@Property()
  public ExpiryDate: string;
}