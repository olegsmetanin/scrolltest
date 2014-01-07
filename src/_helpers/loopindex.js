module.exports.register = function (Handlebars, options)  {
	Handlebars.registerHelper('loopindex', function(value){
		this.loopindex = value; //I needed human readable index, not zero based
	});
};