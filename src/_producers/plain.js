module.exports.register = function (yassemble) {

	var _ = require('lodash');

	yassemble.registerProducer('plain', function (data, options) {

		var category = options.category,

			filteredItems = _.filter(data.sourcedata, function (item) {
				if (typeof item.categories === 'undefined') {
					return false;
				} else {
					return (_.isArray(item.categories) ? item.categories.indexOf(category) !== -1 : item.categories === category)
				}
			})

		return filteredItems;
	});
};