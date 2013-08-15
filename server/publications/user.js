Meteor.publish("userData", function() {
	return Meteor.users.find({
		_id: this.userId
	}, {
		fields: {
			'identity': 1,
			'points': 1,
			'achievements': 1,
			'profile': 1,
			'collections': 1,
			'courses': 1
		}
	});
});

//Meteor.publish("otherUser", function(id){
//    return id && Meteor.users.find({_id: id}, {fields: {
//        'identity': 1,
//        'points': 1,
//        'profile': 1,
//        'achievements': 1
//    }})
//})