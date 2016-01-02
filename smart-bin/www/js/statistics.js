function initStatistics() {
    showLoader();
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

function printGraph(graph) {
    var graphEl = $("#graph canvas")[0].getContext("2d");
    var myLineChart = new Chart(graphEl).Line(graph, {
        scaleFontColor: "rgba(255, 255, 255, 0.6)"
    });
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
    setRange(null, "thisyear");
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
    showLoader();
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
    $("#view-show-bins").append(viewShowBins);
    ids = 5;
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
        console.log(type);
        processGraph(history, type);
    });
}

function processGraph(bins, type) {
    bins = [bins];
    bins.UnixFrom = moment($("#date-start").val(), "DD/MM/YYYY").unix();
    bins.UnixTo = moment($("#date-end").val(), "DD/MM/YYYY").unix();
    // TODO: Months of previous year are thought of as months of this year (e.g. when current month is march, he will show Januari, Februari, March, October, November, December instead of October, November, December, Januari, Februari, March
    var graph = {};
    graph.labels = [];
    graph.datasets = [];
    var daysInType;
    switch (type) {
        case "days":
            daysInType = 1;
            break;
        case "weeks":
            daysInType = 7;
            break;
        case "months":
            daysInType = 30.5;
            break;
        case "years":
            daysInType = 366;
            break;
    }
    var margin = (bins.UnixTo - bins.UnixFrom) / 4;
    if ((bins.UnixTo - bins.UnixFrom) / 3600 / 24 / daysInType < 5) margin = 3600 * 24 * daysInType;
    for (var i = bins.UnixFrom; i <= bins.UnixTo; i += margin) {
        var timestamp = moment(new Date(i * 1000));
        var label;
        if (i == bins.UnixFrom || i == bins.UnixTo) {
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
    //console.log(graph.labels);
    var graphSettings = {
        label: "Bin graph",
        fillColor: "transparent",
        strokeColor: "rgba(220, 220, 220, 1)",
        pointColor: "rgba(220, 220, 220, 1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220, 220, 220, 1)"
    };
    var i = 0;
    var total = bins.length;
    $.each(bins, function () {
        var bin = this;
        graph.data = [0];
        var dataByType = {};
        graph.datasets[i] = graphSettings;
        $.each(bin.History, function (k, v) {
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
        graph.datasets[i].data = graph.data;
        var binTypeColor = convertBinType($("#checkbox-" + this.BinId).data("bin-type")).color;
        graph.datasets[i].strokeColor = binTypeColor;
        graph.datasets[i].pointColor = binTypeColor;
        i++;
        if (i == total) processBinsHistory(graph);
    });
}

function processBinsHistory(graph) {
    console.log(graph);
    var graphEl = $("#graph canvas")[0].getContext("2d");
    var myLineChart = new Chart(graphEl).Line(graph, {
        scaleFontColor: "rgba(255, 255, 255, 0.6)"
    });
    hideLoader();
}









