module.exports.register = function (Handlebars, options) {

	var _ = require('lodash');

	Handlebars.registerHelper('groupByYear', function (inarr, options) {

		var sorted = _.sortBy(inarr, function (page) {
			return new Date(page.date);
		});

		sorted.reverse();

		var grouped = _.groupBy(sorted, function (page) {
			return (new Date(page.date)).getFullYear();
		});

		var grouped_array = _.transform(grouped, function (result, num, key) {
			return result.push({
				year: key,
				pages: num
			});
		}, []);

		var sortedPages = _.sortBy(grouped_array, function (yearpage) {
			return yearpage.year;
		});

		return options.fn(sortedPages);

	});
};