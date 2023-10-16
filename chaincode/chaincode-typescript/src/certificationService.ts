import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import {Certification} from './certification';
import crypto from 'crypto'
import lodash from 'lodash'

@Info({title: 'Certification Service', description: 'Smart contract for certification'})
export class CertificationServiceContract extends Contract {


	/**
	 * InitLedger 
	 * 
	 * @param ctx Context
	 * @returns Prmoise<void>
	 */
	@Transaction()
	public async InitLedger(ctx: Context): Promise<void> {
		// This is sample Certification to test query
		const certifications: Certification[] = [
				{
					CertifierId: 'randomSampleId1',
					IssueDate: '2023-10-03T12:00:00.000Z',
					CertificateType: 'Type A',
					ExpiryDate: '2025-10-03T12:00:00.000Z',
					PublicKey: 'tasdfasd',
					CertificationId: 'ProCertId'
				},
		];

		for (const certification of certifications) {
			// example of how to write to world state deterministically
			// use convention of alphabetic order
			// we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
			// when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
			await ctx.stub.putState(certification.CertificationId, Buffer.from(stringify(sortKeysRecursive(certification))));
			console.info(`Certification ${certification.CertificationId} initialized`);
		}
	}

	/**
	 * CreateCertification issues a new certification to the world state with given details.
	 * 
	 * @param ctx Context
	 * @param payload Stringified Certification payload
	 * @returns Promise<void>
	 */
	@Transaction()
	@Returns()
	public async CreateCertification(ctx: Context, payload:string): Promise<void> {
		const parsePayload:Certification = JSON.parse(payload)
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
	private async CertificationExists(ctx: Context, id: string): Promise<boolean> {
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
			SignedData: Buffer;
		} = JSON.parse(payload)

		const certificationBuffer = await ctx.stub.getState(parsePayload.CertificationId); // get the certification from chaincode state

		if (!certificationBuffer || certificationBuffer.length === 0) {
				throw new Error(`The certification ${parsePayload.CertificationId} does not exist`);
		}
		const certificationJson: Certification = JSON.parse(certificationBuffer.toString())

		const decryptData = crypto.publicDecrypt(certificationJson.PublicKey, parsePayload.SignedData)
		const parsedData: Certification = JSON.parse(decryptData.toString())
    const decryptCertificationJson = {
			...certificationJson,
			...parsedData
		}

		if(lodash.isEqual(certificationJson,decryptCertificationJson)) {
			return true
		}
		
		return false
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
		
		return certificationJSON.toString()
	}

	// GetAllCertification returns all certification found in the world state.
	@Transaction(false)
	@Returns('string')
	public async GetAllCertification(ctx: Context): Promise<string> {
		const allResults = [];
		// range query with empty string for startKey and endKey does an open-ended query of all certifications in the chaincode namespace.
		const iterator = await ctx.stub.getStateByRange('', '');
		let result = await iterator.next();
		while (!result.done) {
				const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
				let record;
				try {
						record = JSON.parse(strValue);
				} catch (err) {
						console.log(err);
						record = strValue;
				}
				allResults.push(record);
				result = await iterator.next();
		}
		return JSON.stringify(allResults);
	}
}