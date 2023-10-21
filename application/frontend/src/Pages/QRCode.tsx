import React from 'react'
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import { JSEncrypt } from "jsencrypt";



export default function QrCode() {
	const { state } = useLocation();
	// console.log(state.privateKey);

	/*
	Import a PEM encoded RSA private key, to use for RSA-PSS signing.
	Takes a string containing the PEM encoded key, and returns a Promise
	that will resolve to a CryptoKey representing the private key.
	*/
	async function importPrivateKey(pem:string) {
		// fetch the part of the PEM string between header and footer
		const pemHeader = "-----BEGIN PRIVATE KEY-----";
		const pemFooter = "-----END PRIVATE KEY-----";
		const pemContents = pem.substring(
			pemHeader.length,
			pem.length - pemFooter.length,
		);
		console.log(pemContents);
		
		// base64 decode the string to get the binary data
		const binaryDerString = window.atob(pemContents);
		// convert from a binary string to an ArrayBuffer
		const binaryDer = str2ab(binaryDerString);

		return await window.crypto.subtle.importKey(
			"pkcs8",
			binaryDer,
			{
				name: "RSA-PSS",
				hash: "SHA-256",
			},
			true,
			["sign"],
		);
	}
	function str2ab(str:string) {
		const buf = new ArrayBuffer(str.length);
		const bufView = new Uint8Array(buf);
		for (let i = 0, strLen = str.length; i < strLen; i++) {
			bufView[i] = str.charCodeAt(i);
		}
		return buf;
	}

	const tryKey = async() => {
		const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
			{
				name: "RSA-OAEP",
				modulusLength: 2048, // can be 1024, 2048, or 4096
				publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
				hash: { name: "SHA-256" }, // can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
			},
			true, // whether the key is extractable (i.e. can be used in exportKey)
			["decrypt", "encrypt"] // can be any combination of "encrypt" and "decrypt"
		);
		console.log(publicKey, privateKey);
		console.log('asdf',state.privateKey);
		const test = '-----BEGIN PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzL2KqpZKo/w6LhA+z5De0DDDaJKnLDumM0hMh6TgdoazUouXGtveZ9dpYT4Bq1ndVyqvH8O3tLoPd8SHdJmLNsFqAXhNPdSFbX1rZLRsHBoN9PwFPB7EAIcR0Cr9R1uil1aPQtYRbswUha9embgXtjO4xG1met78F5Ro1B6d2+oesvC1lmN8ZkDRNb2mJnsCPagFCuSoGV69tL4IRteAtOg88gLqqDhtIAXFTiVIoSK4D4gFB5qPDOT2pjYcbc9REvGGqFJEj4AUjhgfAT9kOIOyO5xXqb8NLkmsqhPRnyTG0EIEbECmM8AWyPd3FhifGdZNgdD6xI/O21m1GxBd9AgMBAAECggEAEQeFXIt820PWSYslBOdBJgLsl6bZXjuOFbyXZeco1qQZbWIH7XFRKdg0RqVTopO8ZrJqzgdHTX3YuXyjx8VQqZTDnSSTuD79CxaOZ0qCoZHMaFhXEwA7obQT3CVzVl9S4APkXD8ME7z5VVpO9fnJ5XA56P/c7hkvdet2qKiQEV4IAtJDmwDeRNchalVZzqAVsz8Xebi0+K9xLtB8HJyfu/yES9jp8cr55XXlUemQ4kbxV7iq5Aq+0muZEmv74NWif66OHbORnnvXWdYIgjKgFXCi6JvmtRUe3cql+gdTUV6z0BKNpgkLdPasUCnLL0PETQ1U8GTqexsNHIoic3eBHwKBgQDzBKw+RyJPoEqVd0pPDKnfa9IMzKZoEfdmTVi32AeLd7pLBmIg+cnRhqJ5/dOEUVPKsYp1YcgsciJvcXsgI9XruCReEgn/jsLKY9KsRedpTcmRF3J79KKuNrrNuWY+z96DiZX9ieXEQPTs4/m/aAyMI78+JAj92DV/Z0C5SCtFiwKBgQC8wcfImJORG/SUHEtH5/ftmYWimE2goDQ6+ZZYk3UP+6DXaU18K1Pble9yUWt1xA6czjNaHRZaqYrlkFW2xed3V8v+u8Az/hF18rZSsYo7GQdr2yJYMtf/MtM6B+iVyyDS63nD2JJCXDspn3e/irWH9JnuqIBC4Yp3XoPYTa2IFwKBgEV8eY+ZIVtpNspEALBXq57hon7caVxqfrX2ub5fe9DKHC9llNte8PEDMSP2iutTocTcPP3RRr5GqEf7R7xp4rnyvhtTxx4WgOYD4vI1TrTSdCcTcD23Nmjf50v5jh25rCMqTQPg0RzrgdzWVsv/AU90zTMEdLm4f5t9N4mC9DR/AoGAcC0psgkbCc33WF5ITv+I1Ge8h5jD6YXMBJB3zUQ0+b6tI9es+PI27/T3TJUeq+pMVNwmoJNQyaigpzVT+z86BC7lSQoDe+KuNc58lEB2yhBh3LNqgcgVndByv7Ybf4osg6z1vHJk2ZM+hcoDvI2OvLGdGbyCHT00sSQ2bsIbMxkCgYEA6uxJ2XfYBGs+kQDlLk8JhJ3EEkuYIp6tWXa7Fq+6gvghUIGrMrMVVWte3oSQpHzPQkk4PdLmzvuyRU7me+1t7itMrmrUvIPRhXFwhmlqsUHKkEYguMxlmEkI2FD+1SPukBFwo+V1Yco4sYl0DgT8/LaUBoMw7P4kwr1m05kNqfU=-----END PRIVATE KEY-----'
		const importingKey = await importPrivateKey(test)
		console.log(importingKey);
		
		const format = "pkcs8";
		const exportPrivate =  await window.crypto.subtle.exportKey(format, privateKey).then(key => { return key; });
		console.log(exportPrivate);
		


	}
	tryKey()
	// console.log('state QR',state);
	const navigate = useNavigate();
	// This need to pass as props
	const qrText = JSON.stringify({
		"CertificationId": "ProCertId-Kai1",
		"SignedData": "Sq9tIVqs65kl8ywFL9VUX54j+DO3JCspnot/wgpUpiNLZyy+q6nazH2eD03b4sB7fMV8UcYVAavvL0I4Qib3+7Cl72J0M89wjQMtlNo4Ylt7kcgfD1Nm3sdMsvABmRy4SwgwMOKo8pFYMM1gbCOtIhn2JANYTmO1UQNCG4R79UVpRG1lEYHksnXWEYNXK9Vz5jSVOjCq018w31rHBscJTvnSCL5toMkttp+qg601jbD4OnEIntW6S4A++sFjEVls+ShJfms40XT1KgnnWpZg7YJ+jQUXAmfsHzeR4YASLf+Ym6g98boE6qGuy//g9EK75rXiHEZMPsNIQZDtCXxeSw=="
	});

	const home = () => navigate('/', {state:{...state}});

	return (
		<div className="App">
			<header>
				<h1>QR Code</h1>
			</header>
			<div className="App-body">
				<QRCodeSVG value={qrText} size={400}/>
				<button className={"App-button Back-button"} onClick={home}>Back</button>
			</div>
		</div>
	);
}
