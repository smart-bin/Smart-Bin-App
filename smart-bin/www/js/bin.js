function initBinDetails() {
    var binId = getURLParameter("id");
    API.getBin(binId, processBin);
    var now = new Date();
    API.getHistory(binId, now.setMonth(now.getMonth() - 5) / 1000, new Date().getTime() / 1000, processBinHistory);
    $(".mdl-layout__content").on("scroll", checkFixedHeader);
    $(".back-button").on("click", function () {
        window.history.back();
    });
}

function processBin(bin) {
    printBinInfo(bin);
}

function printBinInfo(bin) {
    $("#bin-header h1").text(bin.Name);
    var batteryImage = "";
    var batteryStatus = "";
    var batteryStatusColor = "rgb(0, 0, 0)";
    var batteryLevelRounded = Math.floor(bin.BatteryLevel / 10) * 10;
    if (batteryLevelRounded <= 10) {
        batteryImage = "5";
        batteryStatus = "Critical";
        batteryStatusColor = "rgb(255, 0, 0)";
    } else if (batteryLevelRounded > 10 && batteryLevelRounded <= 25) {
        batteryImage = "20";
        batteryStatus = "Low";
    } else if (batteryLevelRounded > 25 && batteryLevelRounded <= 40) {
        batteryImage = "30";
        batteryStatus = "Moderate";
    } else if (batteryLevelRounded > 40 && batteryLevelRounded <= 60) {
        batteryImage = "50";
        batteryStatus = "Fine";
    } else if (batteryLevelRounded > 60 && batteryLevelRounded <= 85) {
        batteryImage = "70";
        batteryStatus = "Good";
    } else if (batteryLevelRounded > 85 && batteryLevelRounded <= 100) {
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

function checkFixedHeader(e) {
    var el = $(".mdl-layout__content");
    var scroll = el.scrollTop();
    if ($("body").hasClass("scroll") && scroll > 140) {
        $("body").addClass("fixed").removeClass("scroll");
        $(".mdl-layout__header").removeClass("mdl-layout__header--seamed");
    } else if ($("body").hasClass("fixed") && scroll <= 140) {
        $("body").addClass("scroll").removeClass("fixed");
        $(".mdl-layout__header").addClass("mdl-layout__header--seamed");
        el.scrollTop(140);
    }
}

function processBinHistory(data) {
    var passedMonths = [];
    var now = new Date();
    var minUnix = now.setMonth(now.getMonth() - 5) / 1000;
    $.each(data, function () {
        if (this.UnixTimestamp > minUnix) {
            passedMonths.push(this);
        }
    })
    processGraph(passedMonths);
}

function processGraph(data) {
    var graph = {};
    var dataByMonth = [];
    graph.X = [];
    graph.Y = [];
    var currentMonth = -1;
    $.each(data, function () {
        var timestamp = new Date(this.UnixTimestamp * 1000);
        var month = timestamp.getMonth() + 1;
        if (month !== currentMonth) {
            currentMonth = month;
            dataByMonth.push(0);
            graph.X.push(getNameMonth(currentMonth));
        }
        dataByMonth[dataByMonth.length - 1] += this.Weight;
    });
    graph.data = dataByMonth;
    var min = Math.min.apply(Math, graph.data);
    var max = Math.max.apply(Math, graph.data);
    var margin = (max - min) / 5;
    min -= margin;
    max += margin;
    if (min < 0) min = 0;
    for (var i = min; i <= max; i += margin) {
        graph.Y.push(i);
    }
    printGraph(graph);
}

function printGraph(graph) {
    console.log(graph);
}














