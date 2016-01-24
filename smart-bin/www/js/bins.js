function initBins() {
    showLoader();
    API.getUser(getUserId(), "bins", processBins);
    if (getUserId() == 2) {
        $(".mdl-button--fab").addClass("mdl-button--disabled").attr("href", "#");
    }
}

function processBins(output) {
    var cards = "";
    $.each(output.Bins, function () {
        var card = {
            id: this.BinId,
            time: "Nu net",
            title: this.Name,
            subtitle1: "<i class=\"material-icons\">battery_full</i><span>" + this.BatteryLevel + "% batterij</span>",
            subtitle2: "<i class=\"material-icons\">assessment</i><span><span class=\"weight-this-month\">?</span> kg deze maand</span>",
            button1Link: "bin.html?id=" + this.BinId,
            cardClasses: "two-supporting-texts bin-type-card bin-type--" + convertBinType(this.Type.TypeId).class,
            type: "bin",
            button2: false
        };
        cards += formatCard(card);
    });
    $("#bins").append(cards);
    if (output.Bins.length > 0) $("#no-bins-text").addClass("hidden");
    var ids = [];
    $.each($(".card-bin"), function () {
        var binId = $(this).attr("id");
        ids.push(binId.substr(5, binId.length));
    });
    API.getEntireHistory(ids, processTotalWeightThisMonth);
    hideLoader();
}

function processTotalWeightThisMonth(history) {
    $(".weight-this-month").text(0);
    $.each(history.BinHistories, function () {
        var totalWeight = 0;
        var thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0);
        thisMonth.setMinutes(0);
        thisMonth.setSeconds(0);
        thisMonth = thisMonth.getTime();
        $.each(this.History, function () {
            var timestamp = new Date(this.UnixTimestamp * 1000).getTime();
            if (timestamp > thisMonth) totalWeight += this.Weight;
        });
        $("#card-" + this.BinId + " .weight-this-month").text(totalWeight);
    });
}

