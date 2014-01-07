module.exports.register = function (Handlebars, options)  {



	Handlebars.registerHelper('renderpage', function (context, options) {
		//console.log(context);
		var f = Handlebars.compile(context.page);
		return new Handlebars.SafeString(f(context.data));
	});
};