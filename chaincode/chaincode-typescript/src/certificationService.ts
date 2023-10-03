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
						IssueDate: new Date('2023-10-03T12:00:00.000Z'),
						CertificateType: 'Type A',
						ExpiryDate: new Date('2025-10-03T12:00:00.000Z'),
					},
					{
						WalletId: 'hashCodeUserWallet2',
						CertifierId: 'randomSampleId2',
						IssueDate: new Date('2022-01-03T12:00:00.000Z'),
						CertificateType: 'Type B',
						ExpiryDate: new Date('2023-10-01T11:00:00.000Z'),
					},
			];

			for (const certification of certifications) {
				certification.docType = 'certification';
					// example of how to write to world state deterministically
					// use convention of alphabetic order
					// we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
					// when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
					await ctx.stub.putState(certification.CertifierId, Buffer.from(stringify(sortKeysRecursive(certification))));
					console.info(`Asset ${certification.CertifierId} initialized`);
			}
	}

	// CreateCertification issues a new certification to the world state with given details.
	@Transaction()
	public async CreateCertification(ctx: Context, payload:Certification): Promise<void> {
			const exists = await this.CertificationExists(ctx, payload.CertifierId);
			if (exists) {
					throw new Error(`The asset ${payload.CertifierId} already exists`);
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
			const assetJSON = await ctx.stub.getState(id);
			return assetJSON && assetJSON.length > 0;
	}

	// ReadCertification returns the certification stored in the world state with given id.
	@Transaction(false)
	public async ReadCertification(ctx: Context, id: string): Promise<string> {
			const assetJSON = await ctx.stub.getState(id); // get the certification from chaincode state
			if (!assetJSON || assetJSON.length === 0) {
					throw new Error(`The asset ${id} does not exist`);
			}
			return assetJSON.toString();
	}
}