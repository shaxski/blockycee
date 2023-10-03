/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class Asset {
    @Property()
    public docType?: string;

    @Property()
    public ID: string;

    @Property()
    public Color: string;

    @Property()
    public Size: number;

    @Property()
    public Owner: string;

    @Property()
    public AppraisedValue: number;
}


@Object()
export class Certification {
  @Property()
  public docType?: string;
	@Property()
  public WalletId: string;
	@Property()
  public CertifierId: string ;
	@Property()
  public IssueDate: string ;
	@Property()
  public CertificateType: string;
	@Property()
  public ExpiryDate: string;
}