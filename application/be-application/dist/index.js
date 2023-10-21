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
const short_uuid_1 = __importDefault(require("short-uuid"));
const cors_1 = __importDefault(require("cors"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';
const adminWalletPath = path.join(__dirname, 'adminwallet');
const userWalletPath = path.join(__dirname, 'userWallet');
const app = (0, express_1.default)();
const port = 3000;
// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const options = {
    origin: allowedOrigins
};
// Middleware
app.use((0, cors_1.default)(options));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const ccp = (0, AppUtil_1.buildCCPOrg1)();
// build an instance of the fabric ca services client based on
// the information in the network configuration
const caClient = (0, CAUtil_1.buildCAClient)(ccp, 'ca.org1.example.com');
const gateway = new fabric_network_1.Gateway();
app.post('/registerAdmin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orgName = 'Org1MSP', userId = 'admin' } = req.body;
    // setup the wallet to hold the credentials of the application admin user
    try {
        const wallet = yield (0, AppUtil_1.buildWallet)(adminWalletPath);
        // in a real application this would be done on an administrative flow, and only once
        yield (0, CAUtil_1.enrollAdmin)(caClient, wallet, orgName, userId);
        res.status(200).send('Admin wallet created successfully');
    }
    catch (error) {
        console.log(error);
        res.status(400).send("Error: Wallet creation failed");
    }
}));
app.post('/registerUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orgName = 'Org1MSP', userId = 'Kai' } = req.body;
    const uuid = short_uuid_1.default.generate();
    // setup the wallet to hold the credentials of the application user
    try {
        const userWallet = yield (0, AppUtil_1.buildWallet)(userWalletPath);
        const adminWallet = yield (0, AppUtil_1.readWallet)(adminWalletPath);
        // Check user Identity exist first and register
        yield (0, CAUtil_1.registerAndEnrollUser)(caClient, adminWallet, userWallet, orgName, uuid, 'org1.department1');
        res.status(200).json({ did: uuid, userId: userId });
    }
    catch (error) {
        console.log(error);
        res.status(400).send("Error: Wallet creation failed");
    }
}));
app.post('/recordCertification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { DId, CertifierId, CertificationId, IssueDate, CertificateType, ExpiryDate, PublicKey } = _a, params = __rest(_a, ["DId", "CertifierId", "CertificationId", "IssueDate", "CertificateType", "ExpiryDate", "PublicKey"]);
    const isUserExist = (0, AppUtil_1.checkIdentity)(userWalletPath, DId);
    if (!isUserExist) {
        res.status(404).send("Digital Id not found");
    }
    try {
        let wallet = yield (0, AppUtil_1.readWallet)(adminWalletPath);
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
        const { privateKey, publicKey } = crypto_1.default.generateKeyPairSync('rsa', {
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
        const data = Object.assign(Object.assign({}, req.body), { PublicKey: publicKey });
        fs_1.default.appendFileSync(`./${DId}.pem`, privateKey);
        yield contract.submitTransaction('CreateCertification', JSON.stringify(data));
        res.status(200).json({
            privateKey: privateKey
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send("Error: Fail to persist Certification");
    }
}));
app.post('/generateSignedData', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { DId, SignedData } = req.body;
    const privateKey = fs_1.default.readFileSync(`./${DId}.pem`, { encoding: "utf8" });
    const str = JSON.stringify(SignedData);
    const buff = Buffer.from(str, "utf-8");
    const encryptData = crypto_1.default.privateEncrypt(privateKey, buff);
    try {
        res.status(200).json({
            encryptData: encryptData.toString('base64')
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            encryptData: ''
        });
    }
}));
app.get('/certification/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dId = req.params.id;
    const isUserExist = (0, AppUtil_1.checkIdentity)(userWalletPath, dId);
    if (!isUserExist) {
        res.status(404).send("Digital Id not found");
    }
    try {
        let wallet = yield (0, AppUtil_1.readWallet)(adminWalletPath);
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
        let result = yield contract.evaluateTransaction('GetCertificationByDId', dId);
        console.log(`*** Result: ${(0, AppUtil_1.prettyJSONString)(result.toString())}`);
        res.status(200).json(JSON.parse(result.toString()));
    }
    catch (error) {
        console.log(error);
        res.status(404).send("Error: Not Found");
    }
}));
app.post('/verifyCertification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // User create private and public key on their app and send public as payload 
    // This will persist on chain when recordCertification api call
    // Laster during verification Other organization will use these public to validate data.
    const isUserExist = (0, AppUtil_1.checkIdentity)(userWalletPath, req.body.DId);
    if (!isUserExist) {
        res.status(404).send("Digital Id not found");
    }
    const data = Object.assign({}, req.body);
    try {
        let wallet = yield (0, AppUtil_1.readWallet)(adminWalletPath);
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
        let result = yield contract.evaluateTransaction('VerifyCertification', JSON.stringify(data));
        console.log(`*** Result: ${(0, AppUtil_1.prettyJSONString)(result.toString())}`);
        res.status(200).send('Certification verification successfully');
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
