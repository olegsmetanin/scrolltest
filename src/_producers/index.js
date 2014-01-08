module.exports.register = function (yassemble) {

	var _ = require('lodash');


	yassemble.registerProducer('index', function (data, options) {

		var title = options.title,

			category = options.categories[0],

			filteredItems = yassemble.utils.filterByCategories(data.sourcedata, options.categories),

			pagesize = options.pagesize,

			cmax = Math.ceil(filteredItems.length / pagesize),

			pages = [],

			c = 0;

		while (c < cmax) {
			pages.push({
				title: title,
				categories: ["index"],
				index_start: c * pagesize,
				index_end: (c + 1) * pagesize,
				select_cat: category,
				path: '',
				basename: 'index' + (c === 0 ? '' : cmax - c - 1 )
			});
			c += 1;
		}

		return pages;
	});
};