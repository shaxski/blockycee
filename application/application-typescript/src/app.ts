/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Gateway, GatewayOptions } from 'fabric-network';
import * as path from 'path';
import { buildCCPOrg1, buildWallet, prettyJSONString, readWallet } from './utils/AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils/CAUtil';
import crypto from 'crypto'

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';


const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'typescriptAppUser';


async function main() {
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
    const str = "Hey. this is a string!";
    const buff = Buffer.from(str, "utf-8");
    const encryptData=  crypto.publicEncrypt(publicKey, buff);
    console.log('encryptData', encryptData);

    const decryptData= crypto.privateDecrypt(privateKey,encryptData)
    console.log('decryptData', decryptData.toString());
    console.log(publicKey);
    
    
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPOrg1();
        

        // build an instance of the fabric ca services client based on the information in the network configuration
        const caClient = buildCAClient(ccp, 'ca.org1.example.com');

        // setup the wallet to hold the credentials of the application user
        

        let wallet = await buildWallet(walletPath)
        // // in a real application this would be done on an administrative flow, and only once
        await enrollAdmin(caClient, wallet, mspOrg1);

        
        // // in a real application this would be done only when a new user was required to be added
        // // and would be part of an administrative flow
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
        

        // If wallet is created then comment out above and use bottom line to use existing wallet
        // let wallet = await readWallet(walletPath);
        
        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();

        const gatewayOpts: GatewayOptions = {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
        };

        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.
            await gateway.connect(ccp, gatewayOpts);

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);
            

            // Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
            // This type of transaction would only be run once by an application the first time it was started after it
            // deployed the first time. Any updates to the chaincode deployed later would likely not need to run
            // an "init" type function.
            console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
            await contract.submitTransaction('InitLedger');
            console.log('*** Result: committed');

            // Let's try a query type operation (function).
            // This will be sent to just one peer and the result will be shown.
            console.log('\n--> Evaluate Transaction: GetCertificationById, function return certification on the ledger');
            const certificationId = 'ProCertId'
            let result = await contract.evaluateTransaction('GetCertificationById', certificationId);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            // Now let's try to submit a transaction.
            // This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
            // to the orderer to be committed by each of the peer's to the channel ledger.
            console.log('\n--> Submit Transaction: CreateCertification, creates new certification with  arguments');
            
            type CertificationRequest = {
                CertifierId: string; // unique
                CertificationId: string; //unique
                IssueDate: string;
                CertificateType: 'Type A' | 'Type B' | 'Type C';
                ExpiryDate: string;
            }
            const record: CertificationRequest = {
                 CertifierId: 'CompanyId1', // unique
                 CertificationId: 'BCD00001', //unique
                 IssueDate: new Date('2023-10-15T07:50:22.705Z').toISOString(),
                 CertificateType: 'Type A',
                 ExpiryDate: new Date('2025-10-15T07:50:22.705Z').toISOString(),
                 
            }
            let result2 = await contract.submitTransaction('CreateCertification', JSON.stringify(record));
            console.log(`*** Result: ${prettyJSONString(result2.toString())}`);

            console.log('\n--> Evaluate Transaction: GetCertificationById, function return certification on the ledger');
            let result3 = await contract.evaluateTransaction('GetCertificationById', record.CertificationId);
            console.log(`*** Result: ${prettyJSONString(result3.toString())}`);
        
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        process.exit(1);
    }
}

main();


