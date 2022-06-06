module.exports = {
	extends: [
		'plugin:vue/essential',
		'@vue/standard',
		'@vue/typescript/recommended',
		'@nextcloud',
	],
	parserOptions: {
		ecmaVersion: 2020
	},
	ignorePatterns: ["*.d.ts"],
	rules: {
		'jsdoc/check-alignment': 'off',
	},
}
