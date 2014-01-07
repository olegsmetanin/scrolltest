module.exports.register = function (Handlebars, options)  {
	Handlebars.registerHelper('between', function (val, min, max, options)  {
		return ((val >= min && val < max) ? options.fn(this) : options.inverse(this));
	});
};