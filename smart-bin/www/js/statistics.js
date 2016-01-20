function initStatistics() {
    showLoader(3);
    initDatepickers();
    API.getUser(getUserId(), "bins", processBins);
    $(".filter-button").on("click", initSetFilters);
    $("#date-start").on("change", removeActiveRangeClasses);
    $("#date-end").on("change", removeActiveRangeClasses);
    $("#show-bin-all").on("click", checkAllBins);
    $("#show-bin-none").on("click", checkNoBins);
    $("#show-bins-field").on("change", ".show-bin input", onChangeShowBins);
    $("#reset-filters-button").on("click", resetFilters);
    $("#save-filters-button").on("click", applyFilters);
    initDefaultRangeButtons();
}

function initDefaultRangeButtons() {
    $("[data-range=lastyear]").text(moment(new Date()).add(-1, "year").format("YYYY"));
    $("[data-range=thisyear]").text(moment(new Date()).year());
    $("[data-range=thismonth]").text(moment(new Date()).format("MMM"));
    $("[data-range=thisweek]").text("week " + moment(new Date()).week());
    $("#range-defaults [data-range]").on("click", setRange);
}

function removeActiveRangeClasses() {
    $("[data-range].mdl-button--raised.mdl-button--disabled").removeClass("mdl-button--raised mdl-button--disabled");
}

function onChangeShowBins() {
    var checkboxes = $(".show-bin input");
    var length = checkboxes.length;
    var checked = $(".show-bin input:checked");
    $(".show-bin-controller").removeClass("mdl-button--raised mdl-button--disabled");
    if (checked.length == length) {
        $("#show-bin-all").addClass("mdl-button--raised mdl-button--disabled");
    } else if (checked.length == 0) {
        $("#show-bin-none").addClass("mdl-button--raised mdl-button--disabled");
    }
}

function checkAllBins() {
    $(".show-bin input").prop("checked", true).change();
    $(".show-bin").addClass("is-checked");
}

function checkNoBins() {
    $(".show-bin input").prop("checked", false).change();
    $(".show-bin").removeClass("is-checked");
}

function processBins(bins) {
    var checkboxes = "";
    $.each(bins.Bins, function (k, v) {
        var id = "checkbox-" + this.BinId;
        checkboxes += "<label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect ellipsis show-bin\" for=\"" + id + "\">" +
                        "<input type=\"checkbox\" data-bin-type=\"" + v.Type.TypeId + "\" id=\"" + id + "\" class=\"mdl-checkbox__input\" checked>" +
                        "<span class=\"mdl-checkbox__label\">" + v.Name + "</span>" +
                    "</label>";
    });
    $("#show-bins-field").append(checkboxes);
    componentHandler.upgradeAllRegistered();
    applyFilters();
}

function initSetFilters(dialog) {
    var dialog = $('#filter-statistics-dialog')[0];
    dialog.MaterialDialog.show(true);
}

function initDatepickers() {
    $("#date-end").bootstrapMaterialDatePicker({
        weekStart: 0,
        format: "DD/MM/YYYY",
        time: false,
        lang: "nl"
    });
    $("#date-start").bootstrapMaterialDatePicker({
        weekStart: 0,
        format: "DD/MM/YYYY",
        time: false,
        lang: "nl"
    }).on("change", function(e, date) {
        var start = $("#date-start");
        var end = $("#date-end");
        if (moment(start.val(), "DD/MM/YYYY").unix() > moment(end.val(), "DD/MM/YYYY").unix()) end.val(start.val());
        end.bootstrapMaterialDatePicker("setMinDate", date);
    });
    setRange(null, "thismonth");
}

function setRange(e, r) {
    var range;
    if (typeof r !== typeof undefined) {
        range = r;
    } else if (typeof $(this).data("range") !== typeof undefined) {
        range = $(this).data("range");
    }
    var start;
    var end;
    $("[data-range].mdl-button--raised.mdl-button--disabled:not([data-range=" + range +"])").removeClass("mdl-button--raised mdl-button--disabled");
    setTimeout(function () {
        $("[data-range=" + range).addClass("mdl-button--raised mdl-button--disabled");
    }, 100);
    switch (range) {
        case "lastyear":
            var day366 = moment().add(-1, "year").dayOfYear(366);
            start = moment().add(-1, "year").dayOfYear(1);
            end = day366.date() === 1 ? day366.add(-1, "days") : day366;
            break;
        case "thisyear":
            var day366 = moment().dayOfYear(366);
            start = moment().dayOfYear(1);
            end = day366.date() === 1 ? day366.add(-1, "days") : day366;
            break;
        case "thismonth":
            start = moment().date(1);
            end = moment().add(1, "month").date(0);
            break;
        case "thisweek":
            start = moment().day(1);
            end = moment().day(7);
            break;
        default:
            break;
    }
    start = start.format("DD/MM/YYYY");
    end = end.format("DD/MM/YYYY");
    $("#date-start").val(start);
    $("#date-end").val(end);
}

function resetFilters() {
    setRange(null, "thisyear");
    checkAllBins();
}

function applyFilters() {
    showLoader(3);
    var showBins = $(".show-bin:not(.show-bin-controller) input:checked");
    var start = $("#date-start").val();
    var end = $("#date-end").val();
    $("#date-range-start").text(start);
    $("#date-range-end").text(end);
    $('#filter-statistics-dialog')[0].MaterialDialog.close();
    var ids = [];
    var viewShowBins = "";
    $.each(showBins, function () {
        var id = $(this).attr("id").split("-")[1];
        viewShowBins += "<span id=\"view-show-bin-" + id + "\" class=\"view-show-bin ellipsis\"><span class=\"bin-type-thumb bin-type-el bin-type--" + convertBinType($(this).data("bin-type")).class + "\"></span>" + $(this).siblings(".mdl-checkbox__label").text() + "</span>";
        ids.push(id);
    });
    if (showBins.length > 0) {
        $("#view-show-bins").html(viewShowBins).removeClass("hidden");
    } else {
        $("#view-show-bins").addClass("hidden");
    }
    var startUnix = moment(start, "DD/MM/YYYY").unix();
    var endUnix = moment(end, "DD/MM/YYYY").unix();
    API.getHistory(ids, startUnix, endUnix, function (history) {
        var type = "days";
        var days = (endUnix - startUnix) / 3600 / 24;
        if (days <= 35) {
            type = "days";
        } else if (days > 35 && days <= 152) {
            type = "weeks";
        } else if (days > 152 && days <= 731) {
            type = "months";
        } else if (days > 731) {
            type = "years";
        }
        processGraph(history, type);
        processPieTypes(history);
    });
}

function processGraph(history, type) {
    history.UnixFrom = moment($("#date-start").val(), "DD/MM/YYYY").unix();
    history.UnixTo = moment($("#date-end").val(), "DD/MM/YYYY").unix();
    var graph = {};
    graph.labels = [];
    var daysInType;
    var perText = "";
    switch (type) {
        case "days":
            daysInType = 1;
            perText = "dag";
            break;
        case "weeks":
            daysInType = 7;
            perText = "week";
            break;
        case "months":
            daysInType = 30.5;
            perText = "maand";
            break;
        case "years":
            daysInType = 366;
            perText = "jaar";
            break;
    }
    $("#per-text").html("&nbsp;" + perText);
    var margin = (history.UnixTo - history.UnixFrom) / 6;
    for (var i = history.UnixFrom; i < history.UnixTo + margin; i += margin) {
        var timestamp = moment(new Date(i * 1000));
        var label;
        if (i == history.UnixFrom || i == history.UnixTo) {
            label = timestamp.format("D") + "/" + (timestamp.month() + 1) + "/" + timestamp.format("YY");
        } else {
            switch (type) {
                case "days":
                    label = timestamp.date() + "/" + (timestamp.month() + 1) + "/" + timestamp.format("YY");
                    break;
                case "weeks":
                    label = timestamp.day(1).format("D") + "/" + (timestamp.month() + 1) + "/" + timestamp.format("YY");
                    break;
                case "months":
                    label = timestamp.date(1).format("D") + "/" + (timestamp.month() + 1) + "/" + timestamp.format("YY");
                    break;
            }
        }
        if (type == "years") label = timestamp.year();
        graph.labels.push(label);
    }
    graph.datasets = [];
    for (var n = 0, li = history.IdsRequested.length; n < li; n++) {
        var binId = history.IdsRequested[n];
        graph.datasets[n] = {
            label: "Bin graph",
            fillColor: "transparent",
            strokeColor: "rgba(220, 220, 220, 1)",
            pointColor: "rgba(220, 220, 220, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220, 220, 220, 1)",
            binTypeId: 0
        };
        graph.datasets[n].binTypeId = $("#checkbox-" + binId).data("bin-type");
        var binType = convertBinType(graph.datasets[n].binTypeId);
        graph.datasets[n].strokeColor = binType.color;
        graph.datasets[n].pointColor = binType.color;
        graph.datasets[n].data = [0];
        for (var i = 0, lb = history.BinHistories.length; i < lb; i++) {
            var bin = history.BinHistories[i];
            if (bin.BinId == binId) {
                graph.data = [];
                var dataByType = {};
                var nol = graph.labels.length;
                if (bin.History.length == 0) while (nol--) dataByType[nol] = null;
                $.each(bin.History, function (k, v) {
                    for (var i = 0, l = graph.labels.length; i < l; i++) {
                        var unixLabel = moment(graph.labels[i], "D/M/YY").unix();
                        if (!dataByType.hasOwnProperty(unixLabel)) dataByType[unixLabel] = 0;
                        if (graph.labels[i].toString().length == 4) unixLabel = moment(graph.labels[i], "YYYY").unix();
                        if (v.UnixTimestamp >= unixLabel && v.UnixTimestamp < unixLabel + margin) {
                            dataByType[unixLabel] += v.Weight;
                        }
                    }
                });
                $.each(dataByType, function (k, v) {
                    var weight = v;
                    var now = new Date().getTime() / 1000;
                    if (k > now && weight == 0) weight = null;
                    graph.data.push(weight);
                });
                graph.datasets[n].data = graph.data;
            }
        }
    }
    printGraph(graph);
    processBarProportions(graph);
}

function printGraph(graph) {
    var graphEl = $("#graph canvas")[0].getContext("2d");
    var myLineChart = new Chart(graphEl).Line(graph, {
        scaleFontColor: "rgba(255, 255, 255, 0.6)",
        scaleGridLineColor : "rgba(255, 255, 255, 0.05)"
    });
    hideLoader();
}

function processPieTypes(history) {
    var pie = [];
    for (var i = 0, lb = history.BinHistories.length; i < lb; i++) {
        var totalWeight = 0;
        var bin = history.BinHistories[i];
        $.each(bin.History, function (k, v) {
            totalWeight += v.Weight;
        });
        var binTypeEl = $("#checkbox-" + bin.BinId);
        var binColor = convertBinType(binTypeEl.data("bin-type")).color;
        var binName = binTypeEl.siblings(".mdl-checkbox__label").text();
        pie.push({
            value: totalWeight,
            color: binColor,
            highlight: binColor,
            label: binName
        });
    }
    printPieTypes(pie);
}

function printPieTypes(pie) {
    var pieEl = $("#pie-types canvas")[0].getContext("2d");
    var myDoughnutChart = new Chart(pieEl).Doughnut(pie, {
        segmentStrokeColor : $("#pie-types .statistic-card-inner").css("background-color"),
        segmentStrokeWidth : 3
    });
    hideLoader();
}

function processBarProportions(graph) {
    var recycled = [];
    var waste = [];
    var labelCount = graph.labels.length;
    while (labelCount--) {
        recycled.push(0);
        waste.push(0);
    }
    $.each(graph.datasets, function () {
        var type = this.binTypeId == 0 ? "waste" : "recycled";
        for (var i = 0, l = graph.labels.length; i < l; i++) {
            var weight = this.data[i];
            if (weight === null) weight = 0;
            if (type === "waste") waste[i] += weight;
            else if (type === "recycled") recycled[i] += weight;
        }
    });
    var wasteColor = convertBinType(0).color;
    var bar = {
        labels: graph.labels,
        datasets: [
            {
                label: "Gerecycled",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: recycled
            },
            {
                label: "Restafval",
                fillColor: convertColor(wasteColor, 0.5),
                strokeColor: convertColor(wasteColor, 0.8),
                highlightFill: convertColor(wasteColor, 0.75),
                highlightStroke: convertColor(wasteColor, 1),
                data: waste
            }
        ]
    };
    printBarProportions(bar);
}

function printBarProportions(bar) {
    var barEl = $("#bar-proportions canvas")[0].getContext("2d");
    var myBarChart = new Chart(barEl).Bar(bar, {
        scaleFontColor: "rgba(255, 255, 255, 0.6)",
        scaleGridLineColor : "rgba(255, 255, 255, 0.05)"
    });
    hideLoader();
}







