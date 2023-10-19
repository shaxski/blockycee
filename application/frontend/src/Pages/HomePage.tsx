/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'


export default function Home() {
	const [uuid, setUuid] = useState('');


	async function postData(url = "", data = {}) {
		// Default options are marked with *
		const response = await fetch(url, {
			method: "POST", 
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		return response.json(); 
	}

	const registerUser = (userId:string) => postData("http://localhost:3000/registerUser", { orgName: "Org1MSP", userId: userId}).then((data) => {
		setUuid(data.did)
	});

	async function handleSubmit(e: { preventDefault: () => void; target: any; }) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;		
		console.log(form);
		
    const formData = new FormData(form);

		registerUser(formData.get('userId')?.toString() ?? 'Kai')
		
  }

  return (
		<div>
		{uuid}
		<form method="post" onSubmit={handleSubmit}>
			<label>
				User Id: <input name="userId" defaultValue="hello" />
			</label>
			<hr />
			<button type="submit">Register</button>
		</form>
		</div>
  );
}
