import React from 'react'

export default function Footer() {
	const currentYear = new Date().getFullYear()

	return (
		<div className='App-footer'>
			© {currentYear} Copyright: {} 
			<a className='text-white' href='#'>
				HappyVirus.com
			</a>
		</div>
	)
}
