/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { GatewayOptions, Wallet, Wallets, Gateway } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const adminWalletPath = path.join(__dirname, 'adminwallet');
const userWalletPath = path.join(__dirname, 'userWallet');

const gateway = new Gateway();

const buildCCPOrg1 = (): Record<string, any> => {
    // load the common connection configuration file
    const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'basic-network',
        'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const fileExists = fs.existsSync(ccpPath);
    if (!fileExists) {
        throw new Error(`no such file or directory: ${ccpPath}`);
    }
    const contents = fs.readFileSync(ccpPath, 'utf8');

    // build a JSON object from the file contents
    const ccp = JSON.parse(contents);

    console.log(`Loaded the network configuration located at ${ccpPath}`);
    return ccp;
};

const buildCCPOrg2 = (): Record<string, any> => {
    // load the common connection configuration file
    const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'basic-network',
        'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
    const fileExists = fs.existsSync(ccpPath);
    if (!fileExists) {
        throw new Error(`no such file or directory: ${ccpPath}`);
    }
    const contents = fs.readFileSync(ccpPath, 'utf8');

    // build a JSON object from the file contents
    const ccp = JSON.parse(contents);

    console.log(`Loaded the network configuration located at ${ccpPath}`);
    return ccp;
};

const checkIdentity = async (walletPath: string, uuid: string): Promise<boolean> => {
    // Check to see if we've already enrolled the user
    const userIdentity = await readWallet(walletPath).then(wallet => wallet.get(uuid))
    if (!userIdentity) {
        return false
    }
    return true
}


const buildWallet = async (walletPath: string): Promise<Wallet> => {
    // Create a new  wallet : Note that wallet is for managing identities.
    let wallet: Wallet;
    if (walletPath) {

        // remove any pre-existing wallet from prior runs
        fs.rmSync(walletPath, { recursive: true, force: true });

        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Built a file system wallet at ${walletPath}`);
    } else {
        wallet = await Wallets.newInMemoryWallet();
        console.log('Built an in memory wallet');
    }

    return wallet;
};

const readWallet = async(walletPath: string): Promise<Wallet> => {
    // Check wallet exist and read
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    
    return wallet
}


const prettyJSONString = (inputString: string): string => {
    if (inputString) {
         return JSON.stringify(JSON.parse(inputString), null, 2);
    } else {
         return inputString;
    }
};

export {
    buildCCPOrg1,
    buildCCPOrg2,
    buildWallet,
    readWallet,
    prettyJSONString,
    checkIdentity
};
