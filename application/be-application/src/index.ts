import express, { Express, Request, Response } from 'express';
import { Gateway, GatewayOptions } from 'fabric-network';
import * as path from 'path';
import { buildCCPOrg1, buildWallet, checkIdentity, prettyJSONString, readWallet } from './utils/AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils/CAUtil';
import { CertificationRequest } from './utils/Models';
import shortUUID from 'short-uuid';
import cors from 'cors';
import crypto from 'crypto';

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const adminWalletPath = path.join(__dirname, 'adminwallet');
const userWalletPath = path.join(__dirname, 'userWallet');


const app: Express = express();
const port = 3000;
// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

// Middleware
app.use(cors(options))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const ccp = buildCCPOrg1();
      
// build an instance of the fabric ca services client based on
// the information in the network configuration
const caClient = buildCAClient(ccp, 'ca.org1.example.com');

const gateway = new Gateway();

app.post('/registerAdmin', async(req: Request, res: Response) => {
	const {orgName='Org1MSP', userId='admin'} = req.body;
	
	// setup the wallet to hold the credentials of the application admin user
	try {
	
		const wallet = await buildWallet(adminWalletPath);
		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, orgName, userId);
		res.status(200).send('Admin wallet created successfully');
	} catch (error) {
		console.log(error);
		res.status(400).send("Error: Wallet creation failed");
	}

});

app.post('/registerUser', async(req: Request, res: Response) => {
	const {orgName='Org1MSP', userId='Kai'} = req.body;

	const uuid = shortUUID.generate();

	// setup the wallet to hold the credentials of the application user
	try {
		
		const userWallet = await buildWallet(userWalletPath);
		const adminWallet = await readWallet(adminWalletPath)

		// Check user Identity exist first and register
		await registerAndEnrollUser(caClient, adminWallet, userWallet, orgName, uuid, 'org1.department1');
		res.status(200).json({did: uuid, userId: userId});
	} catch (error) {
		console.log(error);
		res.status(400).send("Error: Wallet creation failed");
	}

});

app.post('/recordCertification', async(req: Request, res: Response) => {
	const { DId,CertifierId,CertificationId,IssueDate,CertificateType,ExpiryDate,PublicKey, ...params }:CertificationRequest = req.body;


	const isUserExist = checkIdentity(userWalletPath, DId)
	
	if (!isUserExist) {
		res.status(404).send("Digital Id not found");
	}

	
	try {
		let wallet = await readWallet(adminWalletPath);
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

		const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: {
				type: 'spki',
				format: 'pem'
			},
			privateKeyEncoding: {
				type: 'pkcs8',
				format: 'pem'
			}
		});

		const data = {
			...req.body,
			PublicKey: publicKey
		};


		await contract.submitTransaction('CreateCertification', JSON.stringify(data));
		res.status(200).json({
			privateKey: privateKey
		});
	} catch (error) {
		console.log(error);
		res.status(400).send("Error: Fail to persist Certification");
	}

});

app.get('/certification/:id', async(req: Request, res: Response) => {

	const dId = req.params.id;

	const isUserExist = checkIdentity(userWalletPath, dId)
	if (!isUserExist) {
		res.status(404).send("Digital Id not found");
	}

	try {
		let wallet = await readWallet(adminWalletPath);
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

		let result = await contract.evaluateTransaction('GetCertificationByDId', dId);
		console.log(`*** Result: ${prettyJSONString(result.toString())}`);

		res.status(200).json(JSON.parse(result.toString()));
	} catch (error) {
		console.log(error);
		res.status(404).send("Error: Not Found");
	}

});


app.post('/verifyCertification', async(req: Request, res: Response) => {

	// User create private and public key on their app and send public as payload 
	// This will persist on chain when recordCertification api call
	// Laster during verification Other organization will use these public to validate data.

	const isUserExist = checkIdentity(userWalletPath, req.body.DId)
	if (!isUserExist) {
		res.status(404).send("Digital Id not found");
	}
	const data = {
		...req.body
	};
	
	try {
		let wallet = await readWallet(adminWalletPath);
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

		let result = await contract.evaluateTransaction('VerifyCertification', JSON.stringify(data));
		console.log(`*** Result: ${prettyJSONString(result.toString())}`);

		res.status(200).send('Certification verification successfully');
	} catch (error) {
		console.log(error);
		res.status(400).json(error);
	}
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});