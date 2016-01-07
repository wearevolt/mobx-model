export default {
	lowercaseFirstLetter(string) {
		return string.charAt(0).toLowerCase() + string.slice(1);
	},

	upperCaseFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);	
	}
}