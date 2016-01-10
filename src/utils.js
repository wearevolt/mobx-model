let lowercaseFirstLetter = function(string) {
	return string.charAt(0).toLowerCase() + string.slice(1);
}

let upperCaseFirstLetter = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);	
}

export  {
	lowercaseFirstLetter,
	upperCaseFirstLetter
}