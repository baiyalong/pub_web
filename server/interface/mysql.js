mysql = {
	DataSationHourlyReSync: function (date) {
		var f = new Future();
		mysqlPool.getConnection(function (err, connection) {
			connection.query(
				'select * from T_ENV_AUTOMONI_AIRDATA_HOUR_S where datediff(MONITORTIME,?)=0 order by MONITORTIME;',
				[date],
				function (err, rows) {
					connection.release();
					f.return(rows);
				})
		})
		var data = f.wait();
		data.forEach(function (e) {
			var update = {
				stationCode: Number(e.POINTCODE),
				monitorTime: e.MONITORTIME
			};
			update[e.CODE_POLLUTE] = e.AVERVALUE;
			DataStationHourly.upsert({
				stationCode: Number(e.POINTCODE),
				monitorTime: { $gte: e.MONITORTIME, $lte: e.MONITORTIME }
			}, { $set: update })
		})
	},
	syncDataStationHourly: function () {
		var t = DataStationHourly.findOne({}, { sort: { monitorTime: -1 } }).monitorTime;
		var f = new Future();
		mysqlPool.getConnection(function (err, connection) {
			connection.query(
				'select * from T_ENV_AUTOMONI_AIRDATA_HOUR_S where MONITORTIME > ? order by MONITORTIME;',
				[t],
				function (err, rows) {
					connection.release();
					f.return(rows);
				})
		})
		var data = f.wait();
		data.forEach(function (e) {
			var update = {
				stationCode: Number(e.POINTCODE),
				monitorTime: e.MONITORTIME
			};
			update[e.CODE_POLLUTE] = e.AVERVALUE;
			DataStationHourly.upsert({
				stationCode: Number(e.POINTCODE),
				monitorTime: { $gte: e.MONITORTIME, $lte: e.MONITORTIME }
			}, { $set: update })
		})
	},
	syncDataStationDaily: function () {
		var t = DataStationDaily.findOne({}, { sort: { MONITORTIME: -1 } }).MONITORTIME;
		var f = new Future();
		mysqlPool.getConnection(function (err, connection) {
			connection.query(
				'select * from AIR_STATIONDAY_AQI_SRC where MONITORTIME > ? order by MONITORTIME;',
				[t],
				function (err, rows) {
					connection.release();
					f.return(rows);
				})
		})
		var data = f.wait();
		data.forEach(function (e) {
			DataStationDaily.insert(e);
		})
	},
	syncDataCityHourly: function () {
		var t = DataCityHourly.findOne({}, { sort: { TimePoint: -1 } }).TimePoint;
		var f = new Future();
		mysqlPool.getConnection(function (err, connection) {
			connection.query(
				'select * from AIR_CITYHOUR_AQI_DATA where TimePoint > ? order by TimePoint;',
				[t],
				function (err, rows) {
					connection.release();
					f.return(rows);
				})
		})
		var data = f.wait();
		data.forEach(function (e) {
			DataCityHourly.insert(e);
		})
	},
	syncDataCityDaily: function () {
		var t = DataCityDaily.findOne({}, { sort: { MONITORTIME: -1 } }).MONITORTIME;
		var f = new Future();
		mysqlPool.getConnection(function (err, connection) {
			connection.query(
				'select * from AIR_CITYDAY_AQI_SRC where MONITORTIME > ? order by MONITORTIME;',
				[t],
				function (err, rows) {
					connection.release();
					f.return(rows);
				})
		})
		var data = f.wait();
		data.forEach(function (e) {
			DataCityDaily.insert(e);
		})
	}
}

// var d1 = new Date('2014-01-01')
// var d2 = new Date()
// while (d1 <= d2) {
// 	mysql.syncDataCityHourly(d1);
// 	console.log(d1);
// 	d1.setDate(d1.getDate() + 1);
// }



// DataStationHourly.find().forEach(function(e,i){
// 	var date = new Date(e.monitorTime)
// 	DataStationHourly.update(e._id,{$set:{
// 		monitorTime:date
// 	}})
// 	console.log(i)
// })
// var date = new Date('2015-12-05')
// var res = DataStationHourly.find({stationCode:152900051,monitorTime:{$gte:date,$lte:date}}).fetch()

// console.log(res)