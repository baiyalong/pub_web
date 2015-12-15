/**
 * Created by bai on 2015/8/26.
 */

var map = function () {
    var width = $('#map').width();
    var height = $('#map').height();

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0,0)");

    var projection = d3.geo.mercator()
        .center([115, 40])
        .scale(700)
    // .translate([0, 0]);

    var path = d3.geo.path()
        .projection(projection);


    var color = d3.scale.category20();


    d3.json("/mapdata/geometryProvince/15.json", function (error, root) {

        if (error)
            return console.error(error);
        //console.log(root.features);

        svg.selectAll("path")
            .data(root.features)
            .enter()
            .append("path")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", path)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("fill", "yellow");
            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .attr("fill", color(i));
            });

    });
}


var tableCity = function () {
    $.getJSON('/test/detailsTableCity.json', function (data, status) {
        if (status == 'success') {
            var trs = data.reduce(function (p, c) {
                return p + '<tr>' +
                    '<td>' + c.city + '</td>' +
                    '<td>' + c.AQI + '</td>' +
                    '<td>' + c['PM2.5'] + '</td>' +
                    '<td>' + c.PM10 + '</td>' +
                    '<td>' + c.O3 + '</td>' +
                    '</tr>'
            }, '');
            $(trs).appendTo($('#city'));
        }
    });
}


var tableTime = function () {
    $.getJSON('/test/detailsTableTime.json', function (data, status) {
        if (status == 'success') {
            var trs = data.reduce(function (p, c) {
                return p + '<tr>' +
                    '<td>' + c.t + '</td>' +
                    '<td>' + c.q + '</td>' +
                    '<td>' + c.m + '</td>' +
                    '</tr>'
            }, '');
            $(trs).appendTo($('#time'));
        }
    });
}


var tableTerminal = function () {
    $.getJSON('/test/detailsTableTerminal.json', function (data, status) {
        if (status == 'success') {
            var trs = data.reduce(function (p, c) {
                return p + '<tr>' +
                    '<td>' + c.t + '</td>' +
                    '<td>' + c.v + '</td>' +
                    '</tr>'
            }, '');
            $(trs).appendTo($('#terminal'));
        }
    });
}


$(function () {
    map();
    tableCity();
    tableTime();
    tableTerminal();
    chartDay();
    chartMonth();
})

function chartDay() {
    d3.json('/test/cumulativeLineData.json', function (data) {
        nv.addGraph(function () {
            var chart = nv.models.cumulativeLineChart()
                    .x(function (d) {
                        return d[0]
                    })
                    .y(function (d) {
                        return d[1] / 100
                    }) //adjusting, 100% is 1.00, not 100 as it is in the data
                    .color(d3.scale.category10().range())
                    .useInteractiveGuideline(true)
                ;

            chart.xAxis
                .tickValues([1078030800000, 1122782400000, 1167541200000, 1251691200000])
                .tickFormat(function (d) {
                    return d3.time.format('%x')(new Date(d))
                });

            chart.yAxis
                .tickFormat(d3.format(',.1%'));

            d3.select('#chartDay svg')
                .datum(data)
                .call(chart);

            //TODO: Figure out a good way to do this automatically
            nv.utils.windowResize(chart.update);

            return chart;
        });
    });

}

function chartMonth() {
    nv.addGraph(function () {
        var chart = nv.models.multiBarChart()
                // .transitionDuration(350)
                .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                .rotateLabels(0)      //Angle to rotate x-axis labels.
                .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                .groupSpacing(0.1)    //Distance between each group of bars.
            ;

        chart.xAxis
            .tickFormat(d3.format(',f'));

        chart.yAxis
            .tickFormat(d3.format(',.1f'));

        d3.select('#chartMonth svg')
            .datum(exampleData())
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });

//Generate some nice data.

    /* Inspired by Lee Byron's test data generator. */
    function stream_layers(n, m, o) {
        if (arguments.length < 3) o = 0;
        function bump(a) {
            var x = 1 / (.1 + Math.random()),
                y = 2 * Math.random() - .5,
                z = 10 / (.1 + Math.random());
            for (var i = 0; i < m; i++) {
                var w = (i / m - y) * z;
                a[i] += x * Math.exp(-w * w);
            }
        }

        return d3.range(n).map(function () {
            var a = [], i;
            for (i = 0; i < m; i++) a[i] = o + o * Math.random();
            for (i = 0; i < 5; i++) bump(a);
            return a.map(stream_index);
        });
    }

    /* Another layer generator using gamma distributions. */
    function stream_waves(n, m) {
        return d3.range(n).map(function (i) {
            return d3.range(m).map(function (j) {
                var x = 20 * j / m - i / 3;
                return 2 * x * Math.exp(-.5 * x);
            }).map(stream_index);
        });
    }

    function stream_index(d, i) {
        return {x: i, y: Math.max(0, d)};
    }


    function exampleData() {
        return stream_layers(3, 10 + Math.random() * 100, .1).map(function (data, i) {
            return {
                key: 'Stream #' + i,
                values: data
            };
        });
    }
}