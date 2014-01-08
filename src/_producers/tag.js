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

			category = options.category,

			filteredItems = _.filter(data.sourcedata, function (item) {
				if (typeof item.categories === 'undefined') {
					return false;
				} else {
					return (_.isArray(item.categories) ? item.categories.indexOf(category) !== -1 : item.categories === category)
				}
			}),

			groupByTag = yassemble.utils.groupCollectionByTerm(filteredItems, 'tags', 'tag', 'pages'),

			tagPages = _.map(groupByTag,function (item) {

				var tag = item.tag,
					items = item.pages,
					path = options.path,
					pagesize = options.pagesize,
					cmax = Math.ceil(items.length / pagesize),
					indexPages = [],
					c = 0;

				while (c < cmax) {
					indexPages.push({
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

				return indexPages;
			}).flatten();

		return tagPages;
	});
};