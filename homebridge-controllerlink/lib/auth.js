/**
 * Created by kraigm on 1/6/16.
 */

var crypto = require('crypto');

module.exports = AuthKey;

var maxDiff = 1000 * 60 * 60;

function AuthKey(homebridge) {
	var accessKey = "174-39-175";
	accessKey = accessKey.replace(/-/g, "");
	this.accessKey = accessKey + accessKey + accessKey + accessKey;
}

AuthKey.prototype.verifyToken = function(token) {
	try {
		var tokenBuf = new Buffer(token, 'base64');

		// Extract IV and data
		var ivSize = tokenBuf[0];
		var ivEnd = ivSize + 1;
		var iv = tokenBuf.slice(1, ivEnd);
		var data = tokenBuf.slice(ivEnd);

		// Decrypt token data
		var decipher = crypto.createDecipheriv('aes-256-cbc', this.accessKey, iv);
		var decryptedToken = decipher.update(data, 'utf8', 'utf8');
		decryptedToken += decipher.final('utf8');

		// Determine token datetime offset
		var tokenDT = new Date(decryptedToken);
		var curDT = new Date();
		var diff = curDT.getTime() - tokenDT.getTime();

		return Math.abs(diff) < maxDiff;
	} catch (err) {
		return false;
	}
};