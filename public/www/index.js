/**
 * Created by bai on 2015/8/25.
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
        .center([130, 39])
        .scale(650)
    // .translate([0, 0]);

    var path = d3.geo.path()
        .projection(projection);


    var color = d3.scale.category20();


    d3.json("/mapdata/geometryProvince/15.json", function (error, root) {

        if (error)
            return console.error(error);
        console.log(root.features);

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


var table = function () {
    $.getJSON('/test/indexTable.json', function (data, status) {
        if (status == 'success') {
            var trs = data.reduce(function (p, c) {
                return p + '<tr>' +
                    '<td>' + c.city + '</td>' +
                    '<td>' + c.AQI + '</td>' +
                    '<td>' + c.class + '</td>' +
                    '<td>' + c.majorP + '</td>' +
                    '</tr>'
            }, '');
            $(trs).appendTo($('table'));
        }
    });
}


$(function () {
    map();
    table();
})