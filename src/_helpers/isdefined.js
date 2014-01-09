module.exports.register = function (Handlebars, options)  {
	Handlebars.registerHelper('isdefined', function (val, options)  {
		return ((typeof val === 'undefined') ? options.inverse(this) : options.fn(this));
	});
};