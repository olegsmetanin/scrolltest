module.exports.register = function (Handlebars, options)  {
	Handlebars.registerHelper('datebetween', function (val, date1, date2, options)  {
		return ((val >= new Date(date1 ? date1 : 0) && val < new Date(date2 ? date2 : 8640000000000000)) ? options.fn(this) : options.inverse(this));
	});
};