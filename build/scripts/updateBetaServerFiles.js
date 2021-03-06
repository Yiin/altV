const path = require('path')
const fs = require('fs')
const axios = require('axios')

const download = async (url, filename) => {
	const downloadPath = path.resolve(process.cwd(), filename)
	const writer = fs.createWriteStream(downloadPath)

	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream'
	})

	response.data.pipe(writer)
	return new Promise((resolve, reject) => {
		writer.on('finish', resolve)
		writer.on('error', reject)
	})
}

const updateServer = async () => {
	try {
		await Promise.all([
			download('https://alt-cdn.s3.nl-ams.scw.cloud/server/beta/x64_win32/data/vehmodels.bin', 'data/vehmodels.bin'),
			download('https://alt-cdn.s3.nl-ams.scw.cloud/server/beta/x64_win32/data/vehmods.bin', 'data/vehmods.bin'),
			download('https://alt-cdn.s3.nl-ams.scw.cloud/node-module/beta/x64_win32/node-module.dll', 'modules/node-module.dll'),
			download('https://alt-cdn.s3.nl-ams.scw.cloud/server/beta/x64_win32/altv-server.exe', 'altv-server.exe'),
			download('https://alt-cdn.s3.nl-ams.scw.cloud/alt-node/node.dll', 'node.dll')
		])

		console.log('Successfully downloaded newest server files from altv.mp')
	} catch (err) {
		console.error(err)
	}
}

updateServer()
