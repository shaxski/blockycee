import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import {Certification} from './certification';

@Info({title: 'Certification Service', description: 'Smart contract for certification'})
export class CertificationServiceContract extends Contract {
	@Transaction()
	public async InitLedger(ctx: Context): Promise<void> {
			const certifications: Certification[] = [
					{
						WalletId: 'hashCodeUserWallet1',
						CertifierId: 'randomSampleId1',
						IssueDate: '2023-10-03T12:00:00.000Z',
						CertificateType: 'Type A',
						ExpiryDate: '2025-10-03T12:00:00.000Z',
					},
					{
						WalletId: 'hashCodeUserWallet2',
						CertifierId: 'randomSampleId2',
						IssueDate: '2022-01-03T12:00:00.000Z',
						CertificateType: 'Type B',
						ExpiryDate: '2023-10-01T11:00:00.000Z',
					},
			];

			for (const certification of certifications) {
				certification.docType = 'certification';
					// example of how to write to world state deterministically
					// use convention of alphabetic order
					// we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
					// when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
				await ctx.stub.putState(certification.CertifierId, Buffer.from(stringify(sortKeysRecursive(certification))));
				console.info(`Certification ${certification.CertifierId} initialized`);
			}
	}

	// CreateCertification issues a new certification to the world state with given details.
	@Transaction()
	public async CreateCertification(ctx: Context, payload:Certification): Promise<void> {
			const exists = await this.CertificationExists(ctx, payload.CertifierId);
			if (exists) {
					throw new Error(`The certification ${payload.CertifierId} already exists`);
			}

			const certification = {
				...payload
			};

			// we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
			await ctx.stub.putState(payload.CertifierId, Buffer.from(stringify(sortKeysRecursive(certification))));
	}

	// CertificationExists returns true when certification with given CertifierId exists in world state.
	@Transaction(false)
	@Returns('boolean')
	public async CertificationExists(ctx: Context, id: string): Promise<boolean> {
			const certificationJSON = await ctx.stub.getState(id);
			return certificationJSON && certificationJSON.length > 0;
	}

	// ReadCertification returns the certification stored in the world state with given id.
	@Transaction(false)
	public async ReadCertification(ctx: Context, id: string): Promise<string> {
			const certificationJSON = await ctx.stub.getState(id); // get the certification from chaincode state
			if (!certificationJSON || certificationJSON.length === 0) {
					throw new Error(`The certification ${id} does not exist`);
			}
			return certificationJSON.toString();
	}
	// GetAllAssets returns all assets found in the world state.
	@Transaction(false)
	@Returns('string')
	public async GetAllAssets(ctx: Context): Promise<string> {
			const allResults = [];
			// range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
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