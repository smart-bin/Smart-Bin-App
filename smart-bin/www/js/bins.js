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
            image: "img/types/glass_square.png",
            imageColor: "#82ba73",
            button1Link: "bin.html?id=5",
            type: "bin"
        };

        console.log(card);
        $("#bins").append(formatCard(card));
    });
}





