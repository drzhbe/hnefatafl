const path = require('path');

module.exports = {
	entry: './src/client.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'desktop.js'
	}
};
