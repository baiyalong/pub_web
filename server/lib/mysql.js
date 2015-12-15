mysqlPool = mysql.createPool({
	connectionLimit: 100,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'NMHBSource'
});

Future = Npm.require("fibers/future");

// mysql = {
// 	getPollutant: function () {
// 		var fut = new Future();
// 		pool.getConnection(function (err, connection) {
// 			connection.query('select * from POLLUTANT;', function (err, rows) {
// 				console.log(rows);
// 				connection.release();
// 				fut.return(rows);
// 			})
// 		})
// 		return fut.wait();
// 	}
// }

// var res = mysql.getPollutant();

// console.log(res);