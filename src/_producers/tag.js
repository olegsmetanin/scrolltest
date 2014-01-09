module.exports.register = function (yassemble) {

	var _ = require('lodash');

	yassemble.registerProducer('tag', function (data, options) {

		var title = options.title,

			category = options.categories[0],

			filteredItems = yassemble.utils.filterByCategories(data.sourcedata, options.categories),

			groupByTag = yassemble.utils.groupCollectionByTerm(filteredItems, 'tags', 'tag', 'pages'),

			tagPages = _.map(groupByTag,function (item) {

				var tag = item.tag,
					items = item.pages,
					path = options.path,
					pagesize = options.pagesize,
					cmax = Math.ceil(items.length / pagesize),
					pages = [],
					c = 0;

				while (c < cmax) {
					pages.push({
						title: title + tag,
						categories: ["tag"],
						index_start: c * pagesize,
						index_end: (c + 1) * pagesize,
						select_cat: category,
						path: path,
						basename: tag + (c === 0 ? '' : cmax - c - 1 ),
						select_tag: tag,
						next: (c === 0 ? undefined : ( tag+ (c === 1 ? '': (cmax - c)))),
						previous: ((cmax-c-1 === 0) ? undefined : (tag +(cmax - c -2)))
					});
					c += 1;
				}

				return pages;

			}).flatten();

		return tagPages;
	});
};