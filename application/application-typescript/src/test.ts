import crypto from 'crypto'
import fs from 'fs'

// const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
// 	modulusLength: 2048,
// 	publicKeyEncoding: {
// 		type: 'spki',
// 		format: 'pem'
// 	},
// 	privateKeyEncoding: {
// 		type: 'pkcs8',
// 		format: 'pem'
// 	}
// });


// fs.appendFileSync('./privateKey.pem',privateKey)

// fs.appendFileSync('./publicKey.pem',publicKey)
// const read= fs.readFileSync('./privateKey.pem' , { encoding: "utf8" })
// console.log(read);


// const str = "Hey. this is a string!";
// const buff = Buffer.from(str, "utf-8");
// const encryptData=  crypto.privateEncrypt(read, buff);
// console.log('encryptData', encryptData.toString('base64'));
const generate = {
	"encryptData": "YgUpiKEnZaFkwPAFhZN0bPRWPLMgnufuX2wnB8hyktXrZXdAVvYd4vGruS7J6Aps+iJ7Gokl3XOyBTT0tKO4U99K/NZnyccslPF+OliKApo3bzJz4EyfSQ3B9lP7YDyH7u/4fBKtnCaX8Nf1lfT4aQ7wghLcNpcDV89ZEDwk0eQPx7gmwRNcVaTh09kw6aWo2WvmWxwSODKA3CZx4GRdfIqkpcRXwB7ucXXvm6MMhrGtAv07iGjPHNlCVsYi2VAmonck84LBpYb2FOwfIXv0MBjCDx2bh72VB+R3GBRw13IJb2oZtKeug3eHubLTlz7KIyrroOqWu/jA8E2SYeay5A=="
}
const publicKey ={
	"CertificateType": "Type A",
	"CertificationId": "ProCertId-Kai1",
	"CertifierId": "Organization AUT",
	"DId": "hBLGPZz9qDwqKdgpRJMnDS",
	"ExpiryDate": "2025-10-03T12:00:00.000Z",
	"IssueDate": "2023-10-03T12:00:00.000Z",
	"PublicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2y8tsG7Ajxa0L1HY9+kU\n6w19RdGFJYK56FDHVljCaWEUZYy4Tozuoq6T3EahfA1c2a2Z7Bc2klSss8GYIT3G\nFXYmNBaZVYAt8+g+5dxGOarG1xhdFPrldw6A0cJicZRY9y9FL8AGT6YlM5tfoSXg\nJa1W9GkaYELwHe55XvYcQLCi5pyO4+/CwjWiZjCQ8e56NSyHefBlyIHOOKbdaGYG\nhEjq2FTUpBGDwgDYd1/pgJm8b9emtzfh07EcDtPyGdvS9yjKmSMxXM7IdXi+sGBw\nGN74Mazu182QzxZ9RPPYiIugKqtHOiVcAVEJBzsmpC9OyrWTw672B5ZUYLyu4AIE\nKwIDAQAB\n-----END PUBLIC KEY-----\n"
}
const decryptData= crypto.publicDecrypt(publicKey.PublicKey,Buffer.from(generate.encryptData,'base64'))
console.log('decryptData', decryptData.toString());

