module.exports = {
	'*.{js,ts},*rc.js': ['yarn lint'],
	'{!(package)*.json,*.code-snippets}': ['yarn lint'],
	'package.json': ['yarn lint'],
}