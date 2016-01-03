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

function processBinHistory(output) {
    var history = output.BinHistories[0];
    if (typeof history === typeof undefined) {
        history = {};
        history.BinId = output.IdsRequested[0];
        history.History = [];
    }
    console.log(history);
    var passedMonths = {};
    passedMonths.BindId = history.BinId;
    passedMonths.History = [];
    var now = new Date();
    var minUnix = now.setMonth(now.getMonth() - 6) / 1000;
    $.each(history.History, function () {
        if (this.UnixTimestamp > minUnix) {
            passedMonths.History.push(this);
        }
    });
    processGraph(passedMonths);
    processStatistics(history);
}

function processGraph(history) {
    var graph = {};
    var dataByType = {};
    graph.labels = [];
    graph.data = [0];
    graph.datasets = [{
        label: "Bin graph",
        fillColor: "rgba(43, 39, 87, 1)",
        strokeColor: "rgba(220, 220, 220, 1)",
        pointColor: "rgba(220, 220, 220, 1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220, 220, 220, 1)"
    }];
    var daysInType = 30.5;
    history.UnixFrom = moment(new Date()).add(-6, "months").unix();
    history.UnixTo = moment(new Date()).unix();
    var margin = (history.UnixTo - history.UnixFrom) / 4;
    if ((history.UnixTo - history.UnixFrom) / 3600 / 24 / daysInType < 4) margin = 3600 * 24 * daysInType;
    for (var i = history.UnixFrom - margin; i <= history.UnixTo; i += margin) {
        var timestamp = moment(new Date(i * 1000));
        var label;
        if (i == history.UnixFrom || i == history.UnixTo) {
            label = timestamp.format("D") + "/" + (timestamp.month() + 1) + "/" + timestamp.format("YY");
        } else {
            label = timestamp.date(1).format("D") + "/" + (timestamp.month() + 1) + "/" + timestamp.format("YY");
        }
        graph.labels.push(label);
    }
    $.each(history.History, function (k, v) {
        console.log(v);
        for (var i = 0, l = graph.labels.length; i < l; i++) {
            var unixStart = moment(graph.labels[i], "D/M/YY").unix();
            if (v.UnixTimestamp >= unixStart && v.UnixTimestamp < unixStart + margin) {
                if (!dataByType.hasOwnProperty(graph.labels[i])) dataByType[graph.labels[i]] = 0;
                dataByType[graph.labels[i]] += v.Weight;
            }
        }
    });
    $.each(dataByType, function (k, v) {
        graph.data.push(v);
    });
    graph.datasets[0].data = graph.data;
    printGraph(graph);
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














