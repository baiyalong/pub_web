Meteor.methods({
	exportStation: function () {
		return Station.find({}, { sort: { StationId: 1 }, fields: { _id: 0 } }).fetch()
	}
})