function initBins() {
    API.getUser(getUserId(), "bins", processBins);
}

function processBins(output) {
    console.log(output.Bins);
    $.each(output.Bins, function () {
        var card = {
            id: this.BinId,
            time: "Nu net",
            title: this.Name,
            subtitle1: "<i class=\"material-icons\">battery_full</i><span>" + this.BatteryLevel + "% batterij</span>",
            subtitle2: "<i class=\"material-icons\">assessment</i><span>" + "" + " kg deze maand</span>",
            button1Link: "bin.html?id=" + this.BinId,
            cardClasses: "bin-type-card bin-type--" + convertBinTypeToClass(this.Type.TypeId),
            type: "bin",
            button2: false
        };

        console.log(card);
        $("#bins").append(formatCard(card));
    });
}





