import crypto from 'crypto'
import fs from 'fs'

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


fs.appendFileSync('./privateKey.pem',privateKey)

fs.appendFileSync('./publicKey.pem',publicKey)

const str = "Hey. this is a string!";
const buff = Buffer.from(str, "utf-8");
const encryptData=  crypto.publicEncrypt(publicKey, buff);
console.log('encryptData', encryptData);

const decryptData= crypto.privateDecrypt(privateKey,encryptData)
console.log('decryptData', decryptData.toString());

console.log(publicKey);