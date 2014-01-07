module.exports.register = function (Handlebars, options)  {
	Handlebars.registerHelper('cons', function (val, options)  {
		console.log(val);
		return "";
	});
};