
import {Object, Property} from 'fabric-contract-api';

@Object()
export class User {
  @Property()
  public Id: string; // composition Id userId-Did
	@Property()
	public Status: string;
	@Property()
	public DId: string;
}