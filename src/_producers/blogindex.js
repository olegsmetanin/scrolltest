module.exports.register = function (yassemble) {

	var _ = require('lodash');
	var moment = require('moment');


//	---
//		title: "Index"
//	categories: ["index"]
//	period_start: 2014-01-01
//	period_end: 2015-01-01
//	index_start: 0
//	index_end: 5
//	select_cat: "blogs"
//	---

	yassemble.registerProducer('blogindex', function (data, options) {

		var title = options.title,

			category = options.category,

			filteredItems = _.filter(data.sourcedata, function (item) {
				return (_.isArray(item.categories) ? item.categories.indexOf(category) !== -1 : item.categories === category)
			}),

			groupByYear = _.groupBy(filteredItems, function (item) {
				return moment(item.date).format("YYYY");
			}),

			yearPages = _.map(groupByYear,function (items, year) {

				var period_start = year,
					period_end = moment(year).add('years', 1).format("YYYY"),
					pagesize = options.pagesize,
					cmax = Math.ceil(items.length / pagesize),
					indexPages = [],
					c = 0;

				while (c < cmax) {
					indexPages.push({
						title: title + year,
						categories: ["index"],
						index_start: c * pagesize,
						index_end: (c + 1) * pagesize,
						select_cat: category,
						path: 'platform/blog/' + year,
						basename: 'index' + (c === 0 ? '' : cmax - c - 1 ),
						period_start: period_start,
						period_end: period_end
					});
					c += 1;
				}

				return indexPages;
			}).flatten(),

			groupByMonth = _.groupBy(filteredItems, function (item) {
				return moment(item.date).format("YYYY-MM");
			}),

			monthPages = _.map(groupByMonth,function (items, year) {

				var period_start = year,
					period_end = moment(year).add('months', 1).format("YYYY-MM"),
					pagesize = options.pagesize,
					cmax = Math.ceil(items.length / pagesize),
					indexPages = [],
					c = 0;

				while (c < cmax) {
					indexPages.push({
						title: title + year,
						categories: ["index"],
						index_start: c * pagesize,
						index_end: (c + 1) * pagesize,
						select_cat: category,
						path: 'platform/blog/' + moment(year).format("YYYY/MM"),
						basename: 'index' + (c === 0 ? '' : cmax - c - 1 ),
						period_start: period_start,
						period_end: period_end
					});
					c += 1;
				}

				return indexPages;

			}).flatten(),

			merged = yearPages.concat(monthPages);


		return merged;
	});
};