function initBins() {
    API.getUser(getUserId(), "bins", processBins);
}

function processBins(output) {
    $.each(output.Bins, function () {
        var card = {
            id: this.BinId,
            time: "Nu net",
            title: truncateText(this.Name, 25),
            subtitle1: "<i class=\"material-icons\">battery_full</i><span>" + this.BatteryLevel + "% batterij</span>",
            subtitle2: "<i class=\"material-icons\">assessment</i><span>" + getTotalWeightThisMonth(this.BinId) + " kg deze maand</span>",
            button1Link: "bin.html?id=" + this.BinId,
            cardClasses: "two-supporting-texts bin-type-card bin-type--" + convertBinTypeToClass(this.Type.TypeId),
            type: "bin",
            button2: false
        };
        $("#bins").append(formatCard(card));
    });
}

function getTotalWeightThisMonth(binId) {
    var weight = 0;
    $.ajax({
        dataType: "JSON",
        method:"GET",
        async: false,
        url: API.apiBaseUrl + "history.php?id=" + binId + "&from=0&to=0",
        success: function(history)
        {
            var totalWeight = 0;
            var thisMonth = new Date();
            thisMonth = new Date(thisMonth.getTime() - (thisMonth.getDate() * 86400000) - (thisMonth.getHours() * 3600000)).getTime();
            console.log(thisMonth);
            $.each(history, function () {
                var timestamp = new Date(this.UnixTimestamp * 1000).getTime();
                console.log(this.BinID + " " + this.Date + " kg: " + this.Weight);
                if (timestamp > thisMonth) totalWeight += this.Weight;
            });
            weight = totalWeight;
        }
    });
    return weight;
}





