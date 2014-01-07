module.exports.register = function (Handlebars, options)  {
	Handlebars.registerHelper('fixpath', function (key)  {
		return key.replace(this.filePair.orig.dest+"/", "");
	});
};