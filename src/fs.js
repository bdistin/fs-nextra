const fs = require('fs');
const { promisify } = require('util');

for (const [key, value] of Object.entries(fs)) {
	if (key.includes('Sync')) continue;
	if (`${key}Sync` in fs) exports[key] = promisify(value);
	else exports[key] = value;
}
