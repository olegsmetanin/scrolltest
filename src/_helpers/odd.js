module.exports.register = function (Handlebars, options)  {
	Handlebars.registerHelper('odd', function (param, ifval, elseval)  {
		return  (((param % 2) == 0) ? ifval : elseval);
	});
};