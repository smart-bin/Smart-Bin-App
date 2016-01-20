function initBinDetails() {
    showLoader(3);
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
    $("#battery-level .bin-card-inner").css("background-image", "url(img/battery/battery_square_" + battery.batteryImage + ".png)");
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
    processStatistics(output);
}

function processGraph(history) {
    var graph = {};
    var dataByType = {};
    graph.labels = [];
    graph.data = [];
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
    var margin = (history.UnixTo - history.UnixFrom) / 6;
    for (var i = history.UnixFrom; i < history.UnixTo + margin; i += margin) {
        var timestamp = moment(new Date(i * 1000));
        var label;
        if (i == history.UnixFrom || i == history.UnixTo) {
            label = timestamp.format("D") + "/" + (timestamp.month() + 1) + "/" + timestamp.format("YY");
        } else {
            label = timestamp.date(1).format("D") + "/" + (timestamp.month() + 1) + "/" + timestamp.format("YY");
        }
        graph.labels.push(label);
        dataByType[moment(label, "D/M/YY").unix()] = 0;
    }
    $.each(history.History, function (k, v) {
        var previousLabel = moment(graph.labels[0], "D/M/YY").unix();
        for (var i = 0, l = graph.labels.length; i < l; i++) {
            var unixLabel = moment(graph.labels[i], "D/M/YY").unix();
            var nextLabel = moment(graph.labels[i + 1], "D/M/YY").unix();
            if (i == l - 1) nextLabel = unixLabel + unixLabel - previousLabel;
            if (v.UnixTimestamp >= unixLabel - ((unixLabel - previousLabel) / 2) && v.UnixTimestamp < unixLabel + ((nextLabel - unixLabel) / 2)) {
                dataByType[unixLabel] += v.Weight;
            }
            previousLabel = unixLabel;
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
    hideLoader();
}

function processStatistics(history) {
    var totalWeight = 0;
    var firstTimestamp;
    if (history.BinHistories[0].History.length != 0) firstTimestamp = history.BinHistories[0].History[0].UnixTimestamp * 1000;
    $.each(history.BinHistories[0].History, function () {
        var timestamp = this.UnixTimestamp * 1000;
        if (timestamp < firstTimestamp) firstTimestamp = timestamp;
        totalWeight += this.Weight;
    });
    var numberOfMonths = 1;
    if (history.BinHistories[0].History.length > 1) {
        numberOfMonths = Math.ceil(((new Date().getTime() - firstTimestamp) / 2635200000)); // ms since first weight / ms in one month
        if (new Date().getTime() < firstTimestamp) numberOfMonths = 1;
    }
    var averageWeight = totalWeight / numberOfMonths;
    $("#total-weight").text("Totaal: " + totalWeight + " kg");
    $("#average-weight").text("Gemiddeld: " + Math.round(averageWeight) + " kg/m");
    hideLoader();
}














