import express, { Express, Request, Response } from 'express';
import { Gateway, GatewayOptions } from 'fabric-network';
import * as path from 'path';
import { buildCCPOrg1, buildWallet, prettyJSONString, readWallet } from './utils/AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils/CAUtil';
import { CertificationRequest } from './utils/Models';

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const walletPath = path.join(__dirname, 'wallet');
const userWalletPath = path.join(__dirname, 'wallet-user')


const app: Express = express();
const port = 3000;

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const ccp = buildCCPOrg1();
      
// build an instance of the fabric ca services client based on
// the information in the network configuration
const caClient = buildCAClient(ccp, 'ca.org1.example.com');

const gateway = new Gateway();

app.post('/registerAdmin', async(req: Request, res: Response) => {
	const orgName:string = 'Org1MSP'; // req.body
	// setup the wallet to hold the credentials of the application admin user
	try {
	
		const wallet = await buildWallet(walletPath);
		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, orgName);

	} catch (error) {
		throw new Error("Error: Wallet creation failed");
	}

	res.send('Wallet created successfully');
})

app.post('/registerUser', async(req: Request, res: Response) => {
	console.log('req',req.body);
	
	const {orgName='Org1MSP', userId='testUser1'} = req.body; // const mspOrg1 = 'Org1MSP',  const org1UserId = 'typescriptAppUser';


	// setup the wallet to hold the credentials of the application user
	try {
		
		const userWallet = await buildWallet(userWalletPath);
		const adminWallet = await readWallet(walletPath)
		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow

		// Check user Identity exist first and register
		await registerAndEnrollUser(caClient, adminWallet, userWallet, orgName, userId, 'org1.department1');
	} catch (error) {
		throw new Error("Error: Wallet creation failed");
	}

	res.send('Wallet created successfully');
});


app.post('/recordCertification', async(req: Request, res: Response) => {

	// User create private and public key on their app and send public as payload 
	// This will persist on chain when recordCertification api call
	// Laster during verification Other organization will use these public to validate data.
	const { CertifierId, CertificationId,IssueDate,CertificateType,ExpiryDate, ...params }:CertificationRequest = req.body;

	const data = {
		...req.body
	};


	try {
		let adminWallet = await readWallet(walletPath);
		const gatewayOpts: GatewayOptions = {
			wallet: adminWallet,
			identity: 'admin',
			discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
		};
		// setup the gateway instance
		// The user will now be able to create connections to the fabric network and be able to
		// submit transactions and query. All transactions submitted by this gateway will be
		// signed by this user using the credentials stored in the wallet.
		await gateway.connect(ccp, gatewayOpts);

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		const contract = network.getContract(chaincodeName);

		await contract.submitTransaction('CreateCertification', JSON.stringify(data));
	} catch (error) {
		throw new Error("failed");
		
	}
	res.send('Certification created successfully');

})

app.get('/certification/:id', async(req: Request, res: Response) => {

	const certificationId = req.params.id;

	try {
		let wallet = await readWallet(walletPath);
		const gatewayOpts: GatewayOptions = {
			wallet,
			identity: 'admin',
			discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
		};
		// setup the gateway instance
		// The user will now be able to create connections to the fabric network and be able to
		// submit transactions and query. All transactions submitted by this gateway will be
		// signed by this user using the credentials stored in the wallet.
		await gateway.connect(ccp, gatewayOpts);

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		const contract = network.getContract(chaincodeName);

		let result = await contract.evaluateTransaction('GetCertificationById', certificationId);
		console.log(`*** Result: ${prettyJSONString(result.toString())}`);

		res.status(200).json(JSON.parse(result.toString()));

	} catch (error) {
		throw new Error("failed");
	}

})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});