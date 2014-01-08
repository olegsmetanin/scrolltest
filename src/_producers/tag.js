module.exports.register = function (yassemble) {

	var _ = require('lodash');
	var moment = require('moment');


//	---
//		title: "Index"
//	categories: ["tags"]
//	index_start: 0
//	index_end: 5
//	select_cat: "tags"
//	select_tag: "abc"
//	---

	yassemble.registerProducer('tag', function (data, options) {

		//console.log('here');

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
						select_tag: tag
					});
					c += 1;
				}

				return pages;

			}).flatten();

		return tagPages;
	});
};