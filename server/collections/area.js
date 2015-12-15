/**
 * Created by bai on 2015/9/6.
 */



Area.attachSchema(new SimpleSchema({
  code: {
    type: Number
  },
  name: {
    type: String
  },
  longitude: {
    type: Number,
    decimal: true
  },
  latitude: {
    type: Number,
    decimal: true
  },
  weatherID: {
    type: Number
  }
}));


Meteor.publish('city', function() {
  return Area.find({
    $and: [{
      code: {
        $mod: [100, 0]
      }
    }, {
      code: {
        $not: {
          $mod: [10000, 0]
        }
      }
    }]
  }, {
    sort: {
      code: 1
    }
  });
});

Meteor.publish('county', function() {
  return Area.find({}, {
    sort: {
      code: 1
    }
  });
})
