
import {Object, Property} from 'fabric-contract-api';

@Object()
export class User {
  @Property()
  public UserId: string;
	@Property()
	public Status: string;
}