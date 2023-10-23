import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import {Certification} from './certification';
import crypto from 'crypto'
import lodash from 'lodash'
import { User } from './user';

@Info({title: 'Certification Service', description: 'Smart contract for certification'})
export class CertificationServiceContract extends Contract {

	/**
	 * CreateUser issues a new user Id to the world state with given details.
	 * 
	 * @param ctx Context
	 * @param payload Stringified User payload
	 * @returns Promise<void>
	 */
		@Transaction()
		public async CreateUser(ctx: Context, payload:string): Promise<void> {
			const parsePayload = JSON.parse(payload);
			const exists = await this.CertificationExists(ctx, parsePayload.UserId);
			if (exists) {
					throw new Error(`The certification for ${parsePayload.UserId} already exists`);
			}
	
			const user:User = {
				Id: `${parsePayload.UserId}-${parsePayload.DId}`,
				Status: parsePayload.Status,
				DId: parsePayload.DId
			};
	
			try {
				// we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
				await ctx.stub.putState(user.Id, Buffer.from(stringify(sortKeysRecursive(user))));
				
			} catch (error) {
				throw new Error(`Fail to persist user data: ${payload}`);
			}
		}

	/**
	 * GetUSer
	 * 
	 * @param ctx Context
	 * @param compositeId String
	 * @returns Promise<string>
	 */
	@Transaction(false)
	@Returns('string')
	public async GetUser(ctx: Context, compositeId:string): Promise<string> {

		const certificationJSON = await ctx.stub.getState(compositeId); // get the certification from chaincode state
		if (!certificationJSON || certificationJSON.length === 0) {
				throw new Error(`The certification for ${compositeId} does not exist`);
		}
		
		return certificationJSON.toString();
	}


	/**
	 * CreateCertification issues a new certification to the world state with given details.
	 * 
	 * @param ctx Context
	 * @param payload Stringified Certification payload
	 * @returns Promise<void>
	 */
	@Transaction()
	public async CreateCertification(ctx: Context, payload:string): Promise<void> {
		const parsePayload:Certification = JSON.parse(payload);
		const exists = await this.CertificationExists(ctx, parsePayload.DId);
		if (exists) {
				throw new Error(`The certification for ${parsePayload.DId} already exists`);
		}

		const certification:Certification = {
			...parsePayload
		};

		try {
			// we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
			await ctx.stub.putState(parsePayload.DId, Buffer.from(stringify(sortKeysRecursive(certification))));
			
		} catch (error) {
			throw new Error(`Fail to persist data: ${payload}`);
		}
	}

	/**
	 * VerifyCertificationByUser verify certification to the world state with given details.
	 * 
	 * @param ctx Context
	 * @param payload Stringified Certification and verify payload
	 * @returns Promise<boolean>
	 */
	@Transaction()
	@Returns('boolean')
	public async VerifyCertificationByUser(ctx: Context, payload:string): Promise<boolean> {
		const parsePayload:{
			verify: boolean,
			certification: Certification
		 } = JSON.parse(payload);
		try {
			await ctx.stub.deleteState(parsePayload.certification.DId)
		} catch (error) {
			console.log(`Fail to remove data: ${parsePayload.certification.DId}`);
			return false;
			
		}
		if (parsePayload.verify) {
			const verifiedRecord:Certification = {
				...parsePayload.certification
			};

			try {
				// we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
				await ctx.stub.putState(verifiedRecord.DId, Buffer.from(stringify(sortKeysRecursive(verifiedRecord))));
				return 
			} catch (error) {
				console.log(`Fail to persist data: ${payload}`);
				return false;
			}
		}
		return false
	}

	/**
	 * CertificationExists returns true when certification with given CertifierId exists in world state.
	 * 
	 * @param ctx Context
	 * @param id String
	 * @returns Promise<boolean>
	 */
	@Transaction(false)
	@Returns('boolean')
	public async CertificationExists(ctx: Context, did: string): Promise<boolean> {
		const certificationJSON = await ctx.stub.getState(did);
		return certificationJSON && certificationJSON.length > 0;
	}

	/**
	 * VerifyCertification
	 * 
	 * @param ctx Context
	 * @param payload Stringified payload
	 * @returns Promise<boolean>
	 */
	@Transaction(false)
	@Returns('boolean')
	public async VerifyCertification(ctx: Context, payload:string): Promise<boolean> {
		const parsePayload:{
			DId: string;
			SignedData: string;
		} = JSON.parse(payload);

		const certificationBuffer = await ctx.stub.getState(parsePayload.DId); // get the certification from chaincode state

		if (!certificationBuffer || certificationBuffer.length === 0) {
				throw new Error(`The certification ${parsePayload.DId} does not exist`);
		}

		
		const certificationJson: Certification = JSON.parse(certificationBuffer.toString());
		const isValid = this.ValidateCertification(certificationJson);

		if (!isValid) {
			throw new Error(`The certification ${parsePayload.DId} is no more valid`);
		}
		
		const decryptData = crypto.publicDecrypt(certificationJson.PublicKey, Buffer.from(parsePayload.SignedData, 'base64'));
		const parsedData: Certification = JSON.parse(decryptData.toString());
    const decryptCertificationJson = {
			...certificationJson,
			...parsedData
		};

		if(lodash.isEqual(certificationJson,decryptCertificationJson)) {
			return true;
		}
		
		return false;
	}


	public ValidateCertification(certification: Certification): boolean {

		const today = new Date();
		const expiry = new Date(certification.ExpiryDate);
		
		if (today < expiry) {
			return true;
		}
		return false;
	}

	/**
	 * GetCertificationByDId
	 * 
	 * @param ctx Context
	 * @param did String
	 * @returns Promise<string>
	 */
	@Transaction(false)
	@Returns('string')
	public async GetCertificationByDId(ctx: Context, did:string): Promise<string> {

		const certificationJSON = await ctx.stub.getState(did); // get the certification from chaincode state
		if (!certificationJSON || certificationJSON.length === 0) {
				throw new Error(`The certification for ${did} does not exist`);
		}
		
		return certificationJSON.toString();
	}

	/**
	 * GetUserbyId
	 * 
	 * @param ctx Context
	 * @param userId String
	 * @returns Promise<string>
	 */
		@Transaction(false)
		@Returns('string')
		public async GetUserbyId(ctx: Context, userId:string): Promise<string> {
	
			const userJSON = await ctx.stub.getState(userId); // get the user from chaincode state
			if (!userJSON || userJSON.length === 0) {
					throw new Error(`The user for ${userId} does not exist`);
			}
			
			return userJSON.toString();
		}
}