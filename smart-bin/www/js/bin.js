function initBinDetails() {
    var binId = getURLParameter("id");
    API.getBin(binId, processBinAPI);
    var now = new Date();
    API.getHistory(binId, null, null, processBinHistory);
    $(".mdl-layout__content").on("scroll", checkFixedHeader);
    $(".back-button").on("click", back);
}

function processBinAPI(bin) {
    printBinInfo(bin);
}

function printBinInfo(bin) {
    $("#bin-header h1").text(bin.Name);
    var batteryImage = "";
    var batteryStatus = "";
    var batteryStatusColor = "rgb(0, 0, 0)";
    if (bin.BatteryLevel <= 10) {
        batteryImage = "5";
        batteryStatus = "Critical";
        batteryStatusColor = "rgb(255, 0, 0)";
    } else if (bin.BatteryLevel > 10 && bin.BatteryLevel <= 25) {
        batteryImage = "20";
        batteryStatus = "Low";
    } else if (bin.BatteryLevel > 25 && bin.BatteryLevel <= 40) {
        batteryImage = "30";
        batteryStatus = "Moderate";
    } else if (bin.BatteryLevel > 40 && bin.BatteryLevel <= 60) {
        batteryImage = "50";
        batteryStatus = "Fine";
    } else if (bin.BatteryLevel > 60 && bin.BatteryLevel <= 85) {
        batteryImage = "70";
        batteryStatus = "Good";
    } else if (bin.BatteryLevel > 85) {
        batteryImage = "100";
        batteryStatus = "High";
    }
    $("#bin-header").css({
        "background-image": "url(img/types/glass_360x180.png)",
        "background-color": "#82ba73"
    });
    $("#battery-level").css("background-image", "url(img/battery/battery_square_" + batteryImage + ".png)");
    $("#battery-level #battery-status").text(batteryStatus + " (" + Math.round(bin.BatteryLevel) + "%)").css("color", batteryStatusColor);
}

function processBinHistory(history) {
    var passedMonths = [];
    var now = new Date();
    var minUnix = now.setMonth(now.getMonth() - 6) / 1000;
    $.each(history, function () {
        if (this.UnixTimestamp > minUnix) {
            passedMonths.push(this);
        }
    })
    processGraph(passedMonths);
    processStatistics(history);
}

function processGraph(history) {
    var graph = {};
    var dataByMonth = {};
    graph.labels = [];
    graph.data = [];
    $.each(history, function () {
        var timestamp = new Date(this.UnixTimestamp * 1000);
        var month = timestamp.getMonth() + 1;
        var nameMonth = getNameMonth(month);
        if (!dataByMonth.hasOwnProperty(month)) {
            dataByMonth[month] = {
                name: nameMonth,
                month: month,
                weight: 0
            };
            graph.labels.push(month);
        }
        dataByMonth[month].weight += this.Weight;
    });
    graph.datasets = [{
        label: "Bin graph",
        fillColor: "rgba(169,170,166,0.5)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)"
    }];
    $.each(dataByMonth, function () {
        graph.data.push(this.weight);
    });
    graph.datasets[0].data = graph.data;
    graph.labels = graph.labels.sort(function(a,b){return a - b});
    for (var i = 0, l = graph.labels.length; i < l; i++) {
        graph.labels[i] = getNameMonth(graph.labels[i]);
    }
    printGraph(graph);
}

function printGraph(graph) {
    var graphEl = $("#graph canvas")[0].getContext("2d");
    var myLineChart = new Chart(graphEl).Line(graph);
}

function processStatistics(history) {
    var totalWeight = 0;
    var firstTimestamp = new Date().getTime();
    $.each(history, function () {
        var timestamp = new Date(this.UnixTimestamp * 1000);
        if (timestamp < firstTimestamp) firstTimestamp = timestamp;
        totalWeight += this.Weight;
    });
    var averageWeight = totalWeight / ((new Date().getTime() - firstTimestamp) / 2635200000);
    $("#total-weight").text("Totaal: " + totalWeight + " kg");
    $("#average-weight").text("Gemiddeld: " + Math.round(averageWeight) + " kg/m");
}














