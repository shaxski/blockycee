import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import {Certification} from './certification';
import crypto from 'crypto'
import lodash from 'lodash'

@Info({title: 'Certification Service', description: 'Smart contract for certification'})
export class CertificationServiceContract extends Contract {

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
		const exists = await this.CertificationExists(ctx, parsePayload.CertificationId);
		if (exists) {
				throw new Error(`The certification ${parsePayload.CertifierId} already exists`);
		}

		const certification:Certification = {
			...parsePayload
		};

		try {
			// we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
			await ctx.stub.putState(parsePayload.CertificationId, Buffer.from(stringify(sortKeysRecursive(certification))));
			
		} catch (error) {
			throw new Error(`Fail to persist data: ${payload}`);
		}
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
	public async CertificationExists(ctx: Context, id: string): Promise<boolean> {
		const certificationJSON = await ctx.stub.getState(id);
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
			CertificationId: string;
			SignedData: string;
		} = JSON.parse(payload);

		const certificationBuffer = await ctx.stub.getState(parsePayload.CertificationId); // get the certification from chaincode state

		if (!certificationBuffer || certificationBuffer.length === 0) {
				throw new Error(`The certification ${parsePayload.CertificationId} does not exist`);
		}

		
		const certificationJson: Certification = JSON.parse(certificationBuffer.toString());
		const isValid = this.ValidateCertification(certificationJson);

		if (!isValid) {
			throw new Error(`The certification ${parsePayload.CertificationId} is no more valid`);
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
	 * GetCertificationById
	 * 
	 * @param ctx Context
	 * @param id String
	 * @returns Promise<string>
	 */
	@Transaction(false)
	@Returns('string')
	public async GetCertificationById(ctx: Context, id:string): Promise<string> {

		const certificationJSON = await ctx.stub.getState(id); // get the certification from chaincode state
		if (!certificationJSON || certificationJSON.length === 0) {
				throw new Error(`The certification ${id} does not exist`);
		}
		
		return certificationJSON.toString();
	}
}