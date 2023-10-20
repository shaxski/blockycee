async function postData(url = "", data = {}) {
	// Default options are marked with *
	try {
		const response = await fetch(url, {
			method: "POST", 
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			throw new Error(`Error ${response}`);
		}
		return response.json(); 
	} catch (error) {
		throw new Error("Fail to registerUser");
	}
}

export {postData}