module.exports.register = function (Handlebars, options) {
	Handlebars.registerHelper('filterAndSortPages', function (inarr, date1, date2, index_start, index_end, tag, options) {

		function filterByDate(arr) {
			var newarr = [];

			for (var i = 0; i < arr.length; i++) {
				if (typeof arr[i].date === 'undefined') {
					console.log(arr[i].src + " do not have data.date property");
				} else {
					var datetime = (new Date(arr[i].date)).getTime();
					var date1time = (new Date((typeof date1 === 'undefined') ? 0 : date1)).getTime();
					var date2time = (new Date((typeof date2 === 'undefined') ? 8640000000000000 : date2)).getTime();
					if ((datetime >= date1time) && (datetime < date2time)) {
						newarr.push(arr[i]);
					}
				}
			}
			return newarr;
		}

		function filterByTag(arr) {

			if (typeof tag !== 'undefined') {
				var newarr = [];

				for (var i = 0; i < arr.length; i++) {

					var tags = arr[i].tags;

					if (tags.indexOf(tag) != -1) {
						newarr.push(arr[i]);
					}
				}
				return newarr;
			}
			else return arr;
		}


		var outarr0 = filterByDate(inarr);
		var outarr1 = filterByTag(outarr0);


		outarr1.sort(function (a, b) {
			var aProp = a.date;
			var bProp = b.date;
			if (aProp > bProp) {
				return 1;
			} else {
				if (aProp < bProp) {
					return -1;
				}
			}
			return 0;
		})

		outarr1.reverse();

		var resarr = outarr1.slice(index_start, index_end);

		return options.fn(resarr);


	});
};