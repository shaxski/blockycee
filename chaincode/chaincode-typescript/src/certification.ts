
import {Object, Property} from 'fabric-contract-api';


{
  CertificationId: string,
  Signature: "asdfasdfasdfasdf2erA#$SRF"
  {
    verification: "yes, this is me {name}"
    CertifierId: "Org1"
  } // encrypt with privatekey

}

@Object()
export class Certification {
  @Property()
  public docType?: string;
  @Property()
  public publicKey: string;
	@Property()
  public WalletId: string;
	@Property()
  public CertifierId: string; // unique
  @Property()
  public CertificationId: uuid; //unique
	@Property()
  public IssueDate: string;
	@Property()
  public CertificateType: 'Type A' | 'Type B' | 'Type C';
	@Property()
  public ExpiryDate: string;
}