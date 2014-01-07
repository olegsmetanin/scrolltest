module.exports.register = function (Handlebars, options)  {



	Handlebars.registerHelper('includepage', function (context, options) {
		var f = Handlebars.compile(context.page);

//		if (!(typeof f === 'function')) {
//			return "";
//		}
		//console.log(val.page);

		//return "include"

		return new Handlebars.SafeString(f(context));
	});
};