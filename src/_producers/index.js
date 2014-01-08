module.exports.register = function (yassemble) {

	var _ = require('lodash');


	yassemble.registerProducer('index', function (data, options) {

		var title = options.title,

			category = options.category,

			items = _.filter(data.sourcedata, function (item) {
				return (_.isArray(item.categories) ? item.categories.indexOf(category) !== -1 : item.categories === category)
			}),

			pagesize = options.pagesize,

			cmax = Math.ceil(items.length / pagesize),

			indexPages = [],
			
			c = 0;

		while (c < cmax) {
			indexPages.push({
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

		return indexPages;
	});
};