
import {Object, Property} from 'fabric-contract-api';


@Object()
export class Certification {
  @Property()
  public docType?: string;
	@Property()
  public WalletId: string;
	@Property()
  public CertifierId: string;
	@Property()
  public IssueDate: string;
	@Property()
  public CertificateType: 'Type A' | 'Type B' | 'Type C';
	@Property()
  public ExpiryDate: string;
}