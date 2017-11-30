window.d3 = require('d3');
require('./vendor/sankey');

var container = document.querySelector("#step-flow-container");
window.margin = {top: 1, right: 1, bottom: 6, left: 1};
window.width = container.clientWidth - margin.left - margin.right,
window.height = 300 - margin.top - margin.bottom;
window.levels = 17;
window.segmentWidth = container.clientWidth / 8;
window.segmentHeight = 20;

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " TWh"; },
    color = d3.scale.category20();

var svg = null,
    sankey = null;

var energy = {
    "nodes":[
        {"name":"", "step": 0 , "level": 8},
        {"name":"郵寄", "step": 1 , "level": 4},
        {"name":"臨櫃人員", "step": 2, "level": 10},
        {"name":"", "step": 5, "level": 10},
        {"name":"臨櫃人員", "step": 6, "level": 6},
        {"name":"電腦", "step": 2, "level": 3},
        {"name":"電腦", "step": 3, "level": 0},
        {"name":"電腦", "step": 4, "level": 1},
        {"name":"電腦", "step": 5, "level": 2},
        {"name":"印表機", "step": 6, "level": 8},
        {"name":"郵寄", "step": 7, "level": 8},
        {"name":"客服", "step": 5, "level": 6},
        {"name":"超商", "step": 5, "level": 4}
    ],
    "links": [
        {"source": 0, "target":1, "value": 0.1},
        {"source": 1, "target":2, "value": 0.1},
        {"source": 2, "target":3, "value": 0.1},
        {"source": 3, "target":4, "value": 0.1},
        {"source": 1, "target":5, "value": 0.1},
        {"source": 5, "target":6, "value": 0.1},
        {"source": 6, "target":7, "value": 0.1},
        {"source": 7, "target":8, "value": 0.1},
        {"source": 8, "target":9, "value": 0.1},
        {"source": 9, "target":10, "value": 0.1},
        {"source": 1, "target":11, "value": 0.1},
        {"source": 1, "target":12, "value": 0.1}
    ]
};

function drawSvg(id) {
    if( svg)
        d3.select("svg").remove();

    svg = d3.select(id).append("svg").attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + (window.segmentWidth / 2) + "," + -90 + ")")

    sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([width, height]);

    var path = sankey.link();

    sankey
        .nodes(energy.nodes)
        .links(energy.links)
        .layout(1);

    var link = svg.append("g").selectAll(".link")
        .data(energy.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return 1; })
        .style("stroke-dashoffset", function(d) { return 5; })
        .style("stroke-dasharray", function(d) { return 3; })
        .sort(function(a, b) { return b.dy - a.dy; });

    link.append("title")
        .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    var node = svg.append("g").selectAll(".node")
        .data(energy.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { 
            return "translate(" + (d.step * segmentWidth) + "," + ((levels - d.level) * segmentHeight) + ")"; 
        }).on("click", function(d){ 
            alert(d.name);
        });

    node.append("circle")
        // .attr("height", function(d) { return d.dy; })
        // .attr("width", sankey.nodeWidth())
        .attr("cx", function(d) { return 5; })
        .attr("cy", function(d) { return 0; })
        .attr("r", function(d) { return 5; })
        .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
        .append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });

    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return 0; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");
}

drawSvg("#step-flow-container");
drawSvg("#step-flow-container-mobile");

window.onresize =  function() {
    window.width = container.clientWidth - margin.left - margin.right;
    window.segmentWidth = container.clientWidth / 8;
    
    drawSvg("#step-flow-container");
}