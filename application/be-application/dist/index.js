"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fabric_network_1 = require("fabric-network");
const path = __importStar(require("path"));
const AppUtil_1 = require("./utils/AppUtil");
const CAUtil_1 = require("./utils/CAUtil");
const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'typescriptAppUser';
const app = (0, express_1.default)();
const port = 3000;
app.get('/initLedger', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ccp = (0, AppUtil_1.buildCCPOrg1)();
    // registering organization = ca.org1.example.com
    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = (0, CAUtil_1.buildCAClient)(ccp, 'ca.org1.example.com');
    // setup the wallet to hold the credentials of the application user
    let wallet = yield (0, AppUtil_1.buildWallet)(walletPath);
    // in a real application this would be done on an administrative flow, and only once
    yield (0, CAUtil_1.enrollAdmin)(caClient, wallet, mspOrg1);
    // in a real application this would be done only when a new user was required to be added
    // and would be part of an administrative flow
    yield (0, CAUtil_1.registerAndEnrollUser)(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
    const gateway = new fabric_network_1.Gateway();
    const gatewayOpts = {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
    };
    yield gateway.connect(ccp, gatewayOpts);
    // Build a network instance based on the channel where the smart contract is deployed
    const network = yield gateway.getNetwork(channelName);
    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);
    // Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
    // This type of transaction would only be run once by an application the first time it was started after it
    // deployed the first time. Any updates to the chaincode deployed later would likely not need to run
    // an "init" type function.
    console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
    yield contract.submitTransaction('InitLedger');
    console.log('*** Result: committed');
    res.send('Initializing ledger is successful');
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
