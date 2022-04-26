const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

const credentials = 'xavierMB289.github.io/X509-cert-3517585685773702305.pem';

const client = new MongoClient(
	'mongodb+srv://logistics.sqslm.mongodb.net/gameLevels?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority',
	{
		sslKey: credentials,
		sslCert: credentials,
		serverApi: ServerApiVersion.v1
});