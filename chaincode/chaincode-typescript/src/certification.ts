
import {Object, Property} from 'fabric-contract-api';


@Object()
export class Certification {
  @Property()
  public docType?: string;
	@Property()
  public WalletId: string;
	@Property()
  public CertifierId: string ;
	@Property()
  public IssueDate: Date ;
	@Property()
  public CertificateType: 'Type A' | 'Type B' | 'Type C';
	@Property()
  public ExpiryDate: Date;
}