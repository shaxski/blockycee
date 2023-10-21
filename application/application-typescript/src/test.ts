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
const privateKeyWallet = {"privateKey":"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDN+GLPOaPCw6ht\n0R8FhMXcZQhTH+R3fXPctwVBeR7Zficnaqywd+GNxi19A6/HiS4u1D1LLnCeCkxC\nl1Sh3Ncjbc2eVkmhYRCK4TCGdxZfDe9ROK1KYOh/7kqLYmGNJLmAsuBVb2TXJ3sV\nwypdSujwvEE8ANXw8xS+W0C1SEteDP+ousNJv7azc6c2oCx0A97J1n8enGF5EPup\n6kiTayA9UkNg92aHtW+cLXyrNmdxXp4RQDnHofFDe5cf1e/+PMXAaUMlMvV2lJvM\nbqo/0EO0ldLttSxWClefAsvb4fUZumj/v7HK56JGg/UBm/Pel7ZefyBYILlOTchN\nz0TD2c2jAgMBAAECggEABOpUkVVyzwcUUeqXru4IOsY+eJ1eOmvIBBBqE7HsRox4\nKryk+mEiBNwh4cXgwAZKD9wIym6FSYA9aalq36IBkFrieVDd2PgUCPxuyAa3hfUz\nLOEJYakGY2cwaDsk0NV7h9K8/8z0vx22FkLeE/Phsz0K4X+zm1hxukk7NhhPlCL4\nUOFqNC7g1IkKg0DZEj4gsEMeq0QVsbwvPvWrCm42stPMYzBaKfU3MB4BJXUICR9H\n5bk0VjcVHCgom6cRHd70HbIkQ0ZlgV5lzK+DvQPnHNxteMOKZWHIngyAKAIHBSla\nNCBr9JHMojVH7XeW4kZAL9nBRoMsMYhNjoxPWiYz4QKBgQDpGggpry8eurEC3/6y\nYs5K3/4A/UeX4nydk60jdIXNq8f4w1qU6SHPXF/CGFHBdxsNMyX/P4rvudp3gbwI\n6CLbqCoBmM2HUTCcHVoMVyYW0TWIZh/DAJPbG9ZloQHI9NYcSdG/5V60c1B0x4KA\ne1sQV9mLOEdlU4PeStoEKHm2/wKBgQDiNA+4xPH7lj6KwXTm5shpnpU69QNxjmpN\n29FxDard2x28DMu88dRBv++RafF/ppH3fvxtshZ2NE6AjHoFtIjkwCS/BmVNcqow\n8Fas4YV9S429kT0pBObF3qcgvsYka4q0kiTtzlUCHtYt74oB0GQvLPVGg0t2kKQW\nuKr06QitXQKBgHEwGcyb60aBothhihx2y/MhpwY19qCy8o3Vmpn/x8Uh571Mptxu\nA+Pb2Ae4pWJLApC7SHUUFtPnLEUhcvvkNKDynEsgNpTBgNgdjI83diBYQCVWaY/X\n5PPdJZM9xk8dTCZ6VeZXa1A2OlgqVJ0syQA7mD/4+PojvoGfWRPxz4BjAoGAcxTF\ngt0/tx2DCBjQHsD+6S0zAuGwNM+dqarR7VBkw6Y8hHWGGcR2llTNzw81PBpEXMQQ\nLMbTwqNt5NyTH9/vXWGb0EuysipKB8fecOnzfgE4RV9k3D+QIM7b/D7Sk6ja0m8f\ntpSojwGdOZWKgs3Aine2+X7Gn7WKpbyhzSPZtEkCgYAXQIewNVX76pd9aALt6nMy\n6BBNAhbe6SmiJ5dms2LCCLRgBM5xcEVlBdEW+ra3+G2m0W76S8EuuRaTo2UTOvRL\n9noxAqNNLYbBl/7zRcjq0S3PE3dyGzOmc/ODBrgEFCiemRXMZ+CpoZULx/7Si38m\n8kRLWGx9IQMN+bHV+YdP7A==\n-----END PRIVATE KEY-----\n"}

const str = "Hey. this is a string!";
const buff = Buffer.from(str, "utf-8");
const encryptData=  crypto.privateEncrypt(privateKeyWallet.privateKey, buff);
console.log('encryptData', encryptData.toString('base64'));
const generate = {
	"encryptData": "YgUpiKEnZaFkwPAFhZN0bPRWPLMgnufuX2wnB8hyktXrZXdAVvYd4vGruS7J6Aps+iJ7Gokl3XOyBTT0tKO4U99K/NZnyccslPF+OliKApo3bzJz4EyfSQ3B9lP7YDyH7u/4fBKtnCaX8Nf1lfT4aQ7wghLcNpcDV89ZEDwk0eQPx7gmwRNcVaTh09kw6aWo2WvmWxwSODKA3CZx4GRdfIqkpcRXwB7ucXXvm6MMhrGtAv07iGjPHNlCVsYi2VAmonck84LBpYb2FOwfIXv0MBjCDx2bh72VB+R3GBRw13IJb2oZtKeug3eHubLTlz7KIyrroOqWu/jA8E2SYeay5A=="
}


const publicKey = {
	"CertificateType": "Type A",
	"CertificationId": "ProCertId-Kai1",
	"CertifierId": "Organization AUT",
	"DId": "h8zb6rU71xwVEWzB4T3kJD",
	"ExpiryDate": "2025-10-03T12:00:00.000Z",
	"IssueDate": "2023-10-03T12:00:00.000Z",
	"PublicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzfhizzmjwsOobdEfBYTF\n3GUIUx/kd31z3LcFQXke2X4nJ2qssHfhjcYtfQOvx4kuLtQ9Sy5wngpMQpdUodzX\nI23NnlZJoWEQiuEwhncWXw3vUTitSmDof+5Ki2JhjSS5gLLgVW9k1yd7FcMqXUro\n8LxBPADV8PMUvltAtUhLXgz/qLrDSb+2s3OnNqAsdAPeydZ/HpxheRD7qepIk2sg\nPVJDYPdmh7VvnC18qzZncV6eEUA5x6HxQ3uXH9Xv/jzFwGlDJTL1dpSbzG6qP9BD\ntJXS7bUsVgpXnwLL2+H1Gbpo/7+xyueiRoP1AZvz3pe2Xn8gWCC5Tk3ITc9Ew9nN\nowIDAQAB\n-----END PUBLIC KEY-----\n"
}
const decryptData= crypto.publicDecrypt(publicKey.PublicKey,Buffer.from(encryptData.toString('base64'),'base64'))
console.log('decryptData', decryptData.toString());

