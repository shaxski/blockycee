"use strict";
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIdentity = exports.prettyJSONString = exports.readWallet = exports.buildWallet = exports.buildCCPOrg2 = exports.buildCCPOrg1 = void 0;
const fabric_network_1 = require("fabric-network");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';
const adminWalletPath = path.join(__dirname, 'adminwallet');
const userWalletPath = path.join(__dirname, 'userWallet');
const gateway = new fabric_network_1.Gateway();
const buildCCPOrg1 = () => {
    // load the common connection configuration file
    const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'basic-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
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
exports.buildCCPOrg1 = buildCCPOrg1;
const buildCCPOrg2 = () => {
    // load the common connection configuration file
    const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'basic-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
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
exports.buildCCPOrg2 = buildCCPOrg2;
const checkIdentity = (walletPath, uuid) => __awaiter(void 0, void 0, void 0, function* () {
    // Check to see if we've already enrolled the user
    const userIdentity = yield readWallet(walletPath).then(wallet => wallet.get(uuid));
    if (!userIdentity) {
        return false;
    }
    return true;
});
exports.checkIdentity = checkIdentity;
const buildWallet = (walletPath) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new  wallet : Note that wallet is for managing identities.
    let wallet;
    if (walletPath) {
        // // remove any pre-existing wallet from prior runs
        // fs.rmSync(walletPath, { recursive: true, force: true });
        wallet = yield fabric_network_1.Wallets.newFileSystemWallet(walletPath);
        console.log(`Built a file system wallet at ${walletPath}`);
    }
    else {
        wallet = yield fabric_network_1.Wallets.newInMemoryWallet();
        console.log('Built an in memory wallet');
    }
    return wallet;
});
exports.buildWallet = buildWallet;
const readWallet = (walletPath) => __awaiter(void 0, void 0, void 0, function* () {
    // Check wallet exist and read
    const wallet = yield fabric_network_1.Wallets.newFileSystemWallet(walletPath);
    return wallet;
});
exports.readWallet = readWallet;
const prettyJSONString = (inputString) => {
    if (inputString) {
        return JSON.stringify(JSON.parse(inputString), null, 2);
    }
    else {
        return inputString;
    }
};
exports.prettyJSONString = prettyJSONString;
