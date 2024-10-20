import React, { useState, useEffect } from "react"
import "./css/Action.css"

const gcdOverrides = new Set([
	15997, //standard step
	15998, //technical step
	15999,
	16000,
	16001,
	16002, //step actions
	16003, //standard finish
	16004, //technical finish
	16191, //single standard finish
	16192, //double standard finish (WHY IS IT LIKE THIS)
	16193, //single technical finish
	16194, //double technical finish
	16195, //triple technical finish
	16196, //quadruple technical finish
	7418, //flamethrower
	16484, //kaeshi higanbana
	16485, //kaeshi goken
	16486, //kaeshi setsugekka
	2259, //ten
	18805, 
	2261, //chi
	18806,
	2263, //jin
	18807,
	2265, //fuma shurikan
	18873,
	18874,
	18875,
	2267, //raiton
	18877,
	2266, //katon
	18876,
	2268, //hyoton
	18878,
	16492, //hyosho ranryu
	16471, //goka meykakku
	16491, //goka meykakku (16471 is the PvP version, 16491 is the PvE version)
	2270, //doton
	18880,
	2269, //huton
	18879,
	2271, //suiton
	18881,
	2272, //rabbit medium
])

const ogcdOverrides = new Set([
	3559, //bard WM
	116, //bard AP
	114 //bard MB
])

const actionMap = new Map()


function getIdFromJson(jsonData) {
	if (jsonData && jsonData.fields && jsonData.fields.id) {
		return jsonData.fields.id;
	} else {
		return null;
	}
}




export default function Action({ actionId, additionalClasses }) {
	const [apiData, setApiData] = useState(null); // For API data
	const [encodedStr, setEncodedStr] = useState(null); // State for encodedStr
	const [isLoading, setIsLoading] = useState(true); // Track loading state

	// Function to fetch the Icon path from the API
	async function fetchIconPath(url) {
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				mode: 'cors', // Ensures CORS is used
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// Extract the 'path' from the 'fields.Icon'
			const iconPath = data.fields && data.fields.Icon && data.fields.Icon.path
				? data.fields.Icon.path
				: null;

			return iconPath;
		} catch (error) {
			console.error('Error fetching data:', error);
			return null;
		}
	}

	useEffect(() => {
		const apiUrl = `https://beta.xivapi.com/api/1/sheet/Action/${actionId}?fields=Icon,Name,ActionCategoryTargetID&limit=200`;

		// Fetch the icon path and update the encodedStr state
		fetchIconPath(apiUrl).then((iconPath) => {
			if (iconPath) {
				const encoded = iconPath.replace(/\//g, '%2F');
				setEncodedStr(encoded); // Update the encodedStr state
				setIsLoading(false); // Set loading to false once the data is fetched
			}
		});

		// Clean up on component unmount or when actionId changes
		return () => {
			setEncodedStr(null); // Reset encodedStr when actionId changes
			setIsLoading(true);  // Set loading to true when new fetch starts
		};
	}, [actionId]); // Fetch again if actionId changes

	// If data is loading, display a placeholder or spinner
	if (isLoading) {
		return <div>Loading...</div>; // You can replace this with a spinner or placeholder image
	}

	// If there's an issue fetching the encodedStr
	if (!encodedStr) {
		return <div>Error loading icon</div>; // You can customize this error message
	}

	return (
		<img
			className={
				gcdOverrides.has(actionId) ||
					(!ogcdOverrides.has(actionId) && apiData?.ActionCategoryTargetID !== 4)
					? `gcd ${additionalClasses}`
					: `ogcd ${additionalClasses}`
			}
			src={`https://beta.xivapi.com/api/1/asset?path=${encodedStr}&format=png`} // Use encodedStr here
			alt={apiData?.Name || 'Action Icon'}
		/>
	);
}
