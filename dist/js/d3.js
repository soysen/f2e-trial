import * as d3 from "d3";

var svg = d3.select("svg#flow"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    g = svg.append("g").attr("transform", "translate(40,0)");


var tree = d3.cluster().size([height, width - 160]);