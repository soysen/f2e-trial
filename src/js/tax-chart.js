var Highcharts = require('highcharts');
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);

$.get('../csv/tax-comment.csv', function (r) {
    var data = r.split(/\r\n/g);
    data.forEach((item, idx) => {
        data[idx] = item.split(/,/g);
    });

    renderDateChart(data);
});

function renderDateChart(data) {
    var array_by_date = {},
        comment = [0, 0],
        byRole = {
            begin: [0, 0, 0, 0],
            pro: [0, 0, 0, 0]
        },
        categories = [],
        series = [];
    data.forEach(item => {
        var dt = item[0].split(' ');
        if (array_by_date[dt[0]] == undefined) array_by_date[dt[0]] = 1;
        else array_by_date[dt[0]]++;

        if (!item[4] || item[4] == '') comment[0]++;
        else comment[1]++;

        if (item[2] == "新手") byRole.begin[Number(item[3]) - 1]++;
        if (item[2] == "老手") byRole.pro[Number(item[3]) - 1]++;

    });

    for (var i in array_by_date) {
        categories.push(i);
        series.push(array_by_date[i]);
    }
    // cons
    Highcharts.chart('date-chart-container', {
        title: {
            text: 'Flowing by date'
        },
        chart: {
            type: 'line'
        },
        xAxis: {
            categories: categories,
            labels: {
                formatter() {
                    return this.value.replace(/-/g, '/');
                }
            }
        },
        yAxis: {
            title: {
                text: 'Number of like'
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: "flow",
            data: series
        }]
    });

    renderCommentChart(comment);
    renderLikeChart(byRole);
}


function renderLikeChart(ary) {
    var total = {
            begin: 0,
            pro: 0
        },
        score = {
            begin: 0,
            pro: 0
        };

    for (var i = 0; i < ary.begin.length; i++) {
        total.begin += ary.begin[i];
        score.begin += ary.begin[i] * (i + 1);
    }
    for (var i = 0; i < ary.pro.length; i++) {
        total.pro += ary.pro[i];
        score.pro += ary.pro[i] * (i + 1);
    };

    document.querySelector("#begin-score").innerHTML = (score.begin / total.begin).toFixed(1);
    document.querySelector("#pro-score").innerHTML = (score.pro / total.pro).toFixed(1);

    Highcharts.chart('like-chart-container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Role Average like'
        },
        xAxis: {
            categories: ['不喜歡', '沒感覺', '還可以', '喜歡'],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Like numbers'
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '新手',
            data: ary.begin

        }, {
            name: '老手',
            data: ary.pro

        }]
    });
}

function renderCommentChart(comment) {
    Highcharts.chart('comment-chart-container', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Comment or not'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits: {
            enabled: false
        },
        series: [{
            colorByPoint: true,
            data: [{
                name: 'No comment',
                y: comment[0]
            }, {
                name: 'Comment',
                y: comment[1]
            }]
        }]
    });
}