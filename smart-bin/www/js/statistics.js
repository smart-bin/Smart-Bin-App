function initStatistics() {
    initDatepickers();
    API.getUser(getUserId(), "bins", processBins);
    $(".filter-button").on("click", initSetFilters);
    $("#save-filters-button").on("click", applyFilters);
}

function processBins(bins) {
    var checkboxes = "";
    checkboxes += formatCheckbox("show-bin-all", "show-bin show-bin-controller", "Alle", "checked") + formatCheckbox("show-bin-none", "show-bin show-bin-controller", "Geen", "");
    $.each(bins.Bins, function (k, v) {
        checkboxes += formatCheckbox("checkbox-" + k, "show-bin", v.Name, " checked");
    });
    $("#show-bins-field").append(checkboxes);
    componentHandler.upgradeAllRegistered()
    applyFilters();
}

function formatCheckbox(id, classes, text, checked) {
    return "<label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect ellipsis " + classes + "\" for=\"" + id + "\">" +
                "<input type=\"checkbox\" id=\"" + id + "\" class=\"mdl-checkbox__input\"" + checked + ">" +
                "<span class=\"mdl-checkbox__label\">" + text + "</span>" +
            "</label>";
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
    } else if (typeof el.data("range") !== typeof undefined) {
        range = $(this).data("range");
    }
    var start;
    var end;
    switch (range) {
        case "thisyear":
            var day366 = moment().dayOfYear(366);
            start = moment().dayOfYear(1);
            //end = day366.date() === 1 ? day366.add(-1, "days") : day366;
            end = start.add(6);
            break;
        case "month":
            break;
        case "week":
            break;
        default:
            break;
    }
    start = start.format("DD/MM/YYYY");
    end = end.format("DD/MM/YYYY");
    $("#date-start").val(start);
    $("#date-end").val(end);
}

function applyFilters() {
    var showBins = $(".show-bin:not(.show-bin-controller) input:checked");
    var start = $("#date-start").val();
    var end = $("#date-end").val();
    $("#date-range-start").text(start);
    $("#date-range-end").text(end);
    $('#filter-statistics-dialog')[0].MaterialDialog.close();
    var ids = [];
    $.each(showBins, function () {
        ids.push($(this).attr("id").split("-")[1]);
    });
    ids = 7;
    var startUnix = moment(start, "DD/MM/YYYY").unix();
    var endUnix = moment(end, "DD/MM/YYYY").unix();
    API.getHistory(ids, startUnix, endUnix, function (history) {
        var type = "days";
        var days = (endUnix - startUnix) / 3600 / 24;
        if (days <= 10) {
            type = "days";
        } else if (days > 10 && days <= 70) {
            type = "weeks";
        } else if (days > 70 && days <= 366) {
            type = "months";
        } else if (days > 366) {
            type = "years";
        }
        console.log(type);
        processBinsHistory(processGraph(history, type));
    });
}

function processBinsHistory(bins) {
    console.log(bins);
}

function processGraph(bins, type) {
    bins = [bins];
    bins.UnixFrom = moment($("#date-start").val(), "DD/MM/YYYY").unix();
    bins.UnixTo = moment($("#date-end").val(), "DD/MM/YYYY").unix();
    // TODO: Months of previous year are thought of as months of this year (e.g. when current month is march, he will show Januari, Februari, March, October, November, December instead of October, November, December, Januari, Februari, March
    var graph = {};
    var dataByType = {};
    graph.labels = [];
    graph.data = [0];
    graph.datasets = [];

    //graph.labels = graph.labels.sort(function(a,b){return a - b});
    //for (var i = 0, l = graph.labels.length; i < l; i++) {
    //    graph.labels[i] = getNameMonth(graph.labels[i]);
    //}


    if (type == "days") {
        var margin = (bins.UnixTo - bins.UnixFrom) / 5;
        if (margin / 3600 / 24 < 5) margin = (bins.UnixTo - bins.UnixFrom) / 3600 / 5;
        console.log(margin);
        for (var i = bins.UnixFrom; i <= bins.UnixTo; i += margin) {
            var timestamp = moment(new Date(i * 1000));
            graph.labels.push(timestamp.date() + "/" + timestamp.month());
        }
    }
    console.log(graph.labels);
    return;

    var graphSettings = {
        label: "Bin graph",
        fillColor: "rgba(43, 39, 87, 1)",
        strokeColor: "rgba(220, 220, 220, 1)",
        pointColor: "rgba(220, 220, 220, 1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220, 220, 220, 1)"
    };
    $.each(bins, function () {
        $.each(this.History, function (k, v) {
            //var timestamp = new Date(this.UnixTimestamp * 1000);
            //var month = timestamp.getMonth() + 1;
            //var nameMonth = getNameMonth(month);
            //if (!dataByType.hasOwnProperty(month)) {
            //    dataByType[month] = {
            //        name: nameMonth,
            //        month: month,
            //        weight: 0
            //    };
            //}
            //dataByType[month].weight += this.Weight;

        });

        $.each(dataByType, function () {
            graph.data.push(this.weight);
        });
        graph.datasets[0].data = graph.data;
    });
    $.when(function () {
        return API.getBin(history.BinId);
    }).then(function (bin) {
        console.log(o);
    });
    return graph;
}









