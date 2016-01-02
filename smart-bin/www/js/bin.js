function initBinDetails() {
    showLoader();
    var binId = getURLParameter("id");
    API.getBin(binId, processBinAPI);
    API.getEntireHistory([binId], processBinHistory);
    $(".mdl-layout__content").on("scroll", checkFixedHeader);
    $(".back-button").on("click", back);
}

function processBinAPI(bin) {
    bin.BinTypeClass = convertBinType(bin.Type.TypeId).class;
    printBinInfo(bin);
}

function printBinInfo(bin) {
    $("#bin-header h1").text(bin.Name);
    var battery = getBatteryStatus(bin.BatteryLevel);
    $("body").addClass("bin-type--" + bin.BinTypeClass);
    $("#battery-level").css("background-image", "url(img/battery/battery_square_" + battery.batteryImage + ".png)");
    $("#battery-level #battery-status").text(battery.batteryStatus + " (" + Math.round(bin.BatteryLevel) + "%)").css("color", battery.batteryStatusColor);
    hideLoader();
}

function processBinHistory(history) {
    history = history.BinHistories[0];
    var passedMonths = {};
    passedMonths.History = [];
    var now = new Date();
    var minUnix = now.setMonth(now.getMonth() - 6) / 1000;
    $.each(history.History, function () {
        if (this.UnixTimestamp > minUnix) {
            passedMonths.History.push(this);
        }
    });
    printGraph(processGraph(passedMonths, "rgba(43, 39, 87, 1)", "rgba(220, 220, 220, 1)", "rgba(220, 220, 220, 1)"));
    processStatistics(history);
}

function processGraph(history, fillColor, strokeColor, pointColor) {
    // TODO: Months of previous year are thought of as months of this year (e.g. when current month is march, he will show Januari, Februari, March, October, November, December instead of October, November, December, Januari, Februari, March
    var graph = {};
    var dataByMonth = {};
    graph.labels = [];
    var currentMonth = 6;
    graph.data = [0];
    graph.datasets = [{
        label: "Bin graph",
        fillColor: fillColor,
        strokeColor: strokeColor,
        pointColor: pointColor,
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220, 220, 220, 1)"
    }];
    $.each(history.History, function () {
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
    $.each(dataByMonth, function () {
        graph.data.push(this.weight);
    });
    graph.datasets[0].data = graph.data;
    if (graph.labels.length === 0) {
        for (var i = 0; i < 7; i++) {
            var month = currentMonth - i;
            if (month < 1) month += 12;
            graph.labels.push(month);
        }
    } else if (graph.labels.length === 1) {
        var month = graph.labels[0] - 1;
        if (month < 1) month += 12;
        graph.labels.unshift(month);
    }
    graph.labels = graph.labels.sort(function(a,b){return a - b});
    for (var i = 0, l = graph.labels.length; i < l; i++) {
        graph.labels[i] = getNameMonth(graph.labels[i]);
    }
    return graph;
}

function printGraph(graph) {
    var graphEl = $("#graph canvas")[0].getContext("2d");
    var myLineChart = new Chart(graphEl).Line(graph, {
        scaleFontColor: "rgba(255, 255, 255, 0.6)"
    });
}

function processStatistics(history) {
    var totalWeight = 0;
    var firstTimestamp = new Date().getTime();
    $.each(history.History, function () {
        var timestamp = new Date(this.UnixTimestamp * 1000);
        if (timestamp < firstTimestamp) firstTimestamp = timestamp;
        totalWeight += this.Weight;
    });
    var averageWeight = 0;
    if (totalWeight > 0 ) averageWeight = totalWeight / Math.ceil(((new Date().getTime() - firstTimestamp) / 2635200000)); // total weight / ms since first weight / ms in one month
    $("#total-weight").text("Totaal: " + totalWeight + " kg");
    $("#average-weight").text("Gemiddeld: " + Math.round(averageWeight) + " kg/m");
}














