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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const walletPath = path.join(__dirname, 'wallet');
const userWalletPath = path.join(__dirname, 'wallet-user');
const app = (0, express_1.default)();
const port = 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const ccp = (0, AppUtil_1.buildCCPOrg1)();
// build an instance of the fabric ca services client based on
// the information in the network configuration
const caClient = (0, CAUtil_1.buildCAClient)(ccp, 'ca.org1.example.com');
const gateway = new fabric_network_1.Gateway();
app.post('/registerAdmin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orgName = 'Org1MSP'; // req.body
    // setup the wallet to hold the credentials of the application admin user
    try {
        const wallet = yield (0, AppUtil_1.buildWallet)(walletPath);
        // in a real application this would be done on an administrative flow, and only once
        yield (0, CAUtil_1.enrollAdmin)(caClient, wallet, orgName);
    }
    catch (error) {
        throw new Error("Error: Wallet creation failed");
    }
    res.send('Wallet created successfully');
}));
app.post('/registerUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req', req.body);
    const { orgName = 'Org1MSP', userId = 'testUser1' } = req.body; // const mspOrg1 = 'Org1MSP',  const org1UserId = 'typescriptAppUser';
    // setup the wallet to hold the credentials of the application user
    try {
        const userWallet = yield (0, AppUtil_1.buildWallet)(userWalletPath);
        const adminWallet = yield (0, AppUtil_1.readWallet)(walletPath);
        // in a real application this would be done only when a new user was required to be added
        // and would be part of an administrative flow
        // Check user Identity exist first and register
        yield (0, CAUtil_1.registerAndEnrollUser)(caClient, adminWallet, userWallet, orgName, userId, 'org1.department1');
    }
    catch (error) {
        throw new Error("Error: Wallet creation failed");
    }
    res.send('Wallet created successfully');
}));
app.post('/recordCertification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // User create private and public key on their app and send public as payload 
    // This will persist on chain when recordCertification api call
    // Laster during verification Other organization will use these public to validate data.
    const _a = req.body, { CertifierId, CertificationId, IssueDate, CertificateType, ExpiryDate } = _a, params = __rest(_a, ["CertifierId", "CertificationId", "IssueDate", "CertificateType", "ExpiryDate"]);
    const data = Object.assign({}, req.body);
    try {
        let adminWallet = yield (0, AppUtil_1.readWallet)(walletPath);
        const gatewayOpts = {
            wallet: adminWallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
        };
        // setup the gateway instance
        // The user will now be able to create connections to the fabric network and be able to
        // submit transactions and query. All transactions submitted by this gateway will be
        // signed by this user using the credentials stored in the wallet.
        yield gateway.connect(ccp, gatewayOpts);
        // Build a network instance based on the channel where the smart contract is deployed
        const network = yield gateway.getNetwork(channelName);
        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        yield contract.submitTransaction('CreateCertification', JSON.stringify(data));
    }
    catch (error) {
        throw new Error("failed");
    }
    res.send('Certification created successfully');
}));
app.get('/certification/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const certificationId = req.params.id;
    try {
        let wallet = yield (0, AppUtil_1.readWallet)(walletPath);
        const gatewayOpts = {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
        };
        // setup the gateway instance
        // The user will now be able to create connections to the fabric network and be able to
        // submit transactions and query. All transactions submitted by this gateway will be
        // signed by this user using the credentials stored in the wallet.
        yield gateway.connect(ccp, gatewayOpts);
        // Build a network instance based on the channel where the smart contract is deployed
        const network = yield gateway.getNetwork(channelName);
        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        let result = yield contract.evaluateTransaction('GetCertificationById', certificationId);
        console.log(`*** Result: ${(0, AppUtil_1.prettyJSONString)(result.toString())}`);
        res.status(200).json(JSON.parse(result.toString()));
    }
    catch (error) {
        throw new Error("failed");
    }
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
