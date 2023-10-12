import express, { Express, Request, Response } from 'express';
import { Gateway, GatewayOptions } from 'fabric-network';
import * as path from 'path';
import { buildCCPOrg1, buildWallet, prettyJSONString, readWallet } from './utils/AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils/CAUtil';

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'typescriptAppUser';


const app: Express = express();
const port = 3000;

app.post('/registerWallet', async(req: Request, res: Response) => {
	const userName:string = req.body.userName;

	const ccp = buildCCPOrg1();
      
	// build an instance of the fabric ca services client based on
	// the information in the network configuration
	const caClient = buildCAClient(ccp, 'ca.org1.example.com');

	// setup the wallet to hold the credentials of the application user
	try {
		
		const wallet = await buildWallet(walletPath);
		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, userName);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, userName, org1UserId, 'org1.department1');
	} catch (error) {
		throw new Error("Error: Wallet creation failed");
	}

	res.send('Wallet created successfully');
});



app.post('/recordCertification', async(req: Request, res: Response) => {
	//req.body = {
	//  PublicKey: 'Public Key ---- asdokfjioasjdfoijsdifsdf'
	// 	CertifierId: 'mspOrg1',
	// 	IssueDate: '2022-01-03T12:00:00.000Z',
	// 	CertificateType: 'Type B',
	// 	ExpiryDate: '2023-10-01T11:00:00.000Z',
	// }

	const { PublicKey, CertifierId,IssueDate,CertificateType,ExpiryDate, ...params } = req.body;

	const data = {
		...CertificateType.
	}
try {
	await contract.submitTransaction('recordCertification', data);
} catch (error) {
	throw new Error("failed");
	
}
res.send('Certification created successfully');

})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});