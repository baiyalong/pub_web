Meteor.methods({
	exportStation: function () {
		return Station.find().fetch()
	}
})