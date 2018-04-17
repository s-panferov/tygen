module.exports = {
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	transform: {
		'\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
	},
	testMatch: ['<rootDir>/packages/*/src/**/*.spec.(ts|tsx|js)'],
	moduleNameMapper: {
		// 'tools/(.*)': '<rootDir>/../tools/src/$1',
		// 'client/(.*)': '<rootDir>/../client/src/$1',
		// 'main/(.*)': '<rootDir>/../main/src/$1'
	}
}
