Template.flashcardStats.rendered = function () {


}


Template.flashcardStats.renderGraph = function() {
    if (Session.equals("courseTab", "#courseStats"))  {
        console.log("Getting to the courseTab? ", this);
        var _items = Items.find({flashcard: this._id}).fetch();
        var _students = [], _repetitions = [], _repetition = {}, _userName, _userPicture;
        var _self = this;
        if (_items) {
            _items.forEach(function (item) {
                _repetitions = [];
                _userName = Meteor.userDetails.getFullName(item.user);
                _userPicture = Meteor.userDetails.getProfilePicture(item.user);
                item.previousAnswers.forEach(function (previousAnswer) {
                    _repetition = {
                        x: previousAnswer.date,
                        y: previousAnswer.easinessFactor,
                        answer: previousAnswer.answer,
                        evaluation: previousAnswer.evaluation,
                        extraRepetition: previousAnswer.extraRepetition,
                        daysChange: previousAnswer.daysChange,
                        userPicture: _userPicture
                    }
                    _repetitions.push(_repetition);
                })
                _students.push({name: _userName, data: _repetitions})
            })
        }

        console.log("students", _students);


        // Register a parser for the American date format used by Google
//            Highcharts.Data.prototype.dateFormats['m/d/Y'] = {
//                regex: '^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{2})$',
//                parser: function (match) {
//                    return Date.UTC(+('20' + match[3]), match[1] - 1, +match[2]);
//                }
//            };

//    setTimeout()
//        var _table = [];
//        _table[0] = [];
//        _table[0][0].something = "test";
        setTimeout(function() {
            $(".graph[data-id='" + _self._id + "']").highcharts({
                chart: {
                    type: 'spline',
                    zoomType: 'x'
                },
                title: {
                    text: 'Easiness Factor'
                },
                subtitle: {
                    text: document.ontouchstart === undefined ?
                        '(1.3 most difficult - 2.5 easiest)<br/>Click and drag in the plot area to zoom in' :
                        '(1.3 most difficult - 2.5 easiest)<br/>Drag your finger over the plot to zoom in'
                },
                xAxis: {
                    type: 'datetime',
//            tickInterval: 30 * 24 * 3600 * 1000, // one month
//            tickWidth: 0,
//            gridLineWidth: 1,
//            labels: {
//                align: 'left',
//                x: 3,
//                y: -3
//            },
                    tickPixelInterval: 150,
//            maxZoom: 20 * 1000
                    maxZoom: 600000 // one hour
                },
                yAxis: {
                    title: {
                        text: 'Easiness Factor'
                    },
                    min: 1,
                    max: 3
                },
                legend: {
//            align: 'left',
//            verticalAlign: 'top',
//            y: 20,
//            floating: true,
//            borderWidth: 0
                },
                tooltip: {
                    useHTML: true,
                    formatter: function () {
                        var s = '<b style="margin-right: 10px;">' + moment(this.x).format('MMMM Do YYYY, h:mm:ss a') + '</b>';

                        $.each(this.points, function (i, point) {
                            s += '<img class="pull-right" style="width: 90px; height: 90px" src="' + point.point.userPicture + '" alt=""><br/>' + point.series.name + ': <br/><br/>' +
                                ' easinessFactor ' + point.y + '<br/>answer ' + point.point.answer + '<br/>evaluation ' + point.point.evaluation
//                    console.log("point", point);
                        });

                        return s;
                    },
                    shared: true,
                    crosshairs: true

                },

                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
//                        events: {
//                            click: function () {
//                                hs.htmlExpand(null, {
//                                    pageOrigin: {
//                                        x: this.pageX,
//                                        y: this.pageY
//                                    },
//                                    headingText: this.series.name,
//                                    maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
//                                        this.y + ' visits' + this.z + ' z ',
//                                    width: 200
//                                });
//                            }
//                        }
                        },
                        marker: {
                            lineWidth: 1
                        }
                    }
                },
//
//        legend: {
//            layout: 'vertical',
//            align: 'right',
//            verticalAlign: 'middle',
//            borderWidth: 0
//        },
                series: _students

            });
        }, 500);
    }
}

Template.flashcardStats.userName = function () {
    var _userId = this.user;
    console.log("_userId in userName", _userId);
    var _user = Meteor.users.findOne(_userId);
    console.log("_user", _user);
    if (_user && _user.identity) {
        return _user.identity.nick;
    }

}


Template.flashcardStats.flashcardFront = function () {
//    var _currentItem = Items.findOne({_id: Session.get("currentItemId")});
    var front = stripHtml(this.front);


    var _frontPicture

    if (this.frontPicture) {
        _frontPicture = this.frontPicture;
    }


    if (_frontPicture) {
        front = '<a href="' + _frontPicture + '" class="flashcardPicture pull-right slimboxPicture" title="' + front + '"> \
        <img src="' + _frontPicture + '/convert?h=80&w=80" class="editableImage"/></a> \
        <div name="front" class="flashcardFront">' + front + '</div>';
        console.log("front after", front);
    }


    return front;

}

Template.flashcardStats.flashcardBack = function () {
    var back = stripHtml(this.back);
    var _backPicture;

    if (this.backPicture) {
        _backPicture = this.backPicture;
    }

    if (_backPicture) {
        back = '<a href="' + _backPicture + '" class="flashcardPicture pull-right slimboxPicture" title="' + back + '"> \
        <img src="' + _backPicture + '/convert?h=80&w=80" class="editableImage"/></a> \
        <div name="back" class="flashcardBack">' + back + '</div>';
    }

    return back;


}


stripHtml = function (str) {
    return jQuery('<div />', { html: str }).text();
}
