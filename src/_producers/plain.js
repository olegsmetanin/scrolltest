module.exports.register = function (yassemble) {

	yassemble.registerProducer('plain', function (data, options) {

		return yassemble.utils.filterByCategories(data.sourcedata, options.categories);

	});

};