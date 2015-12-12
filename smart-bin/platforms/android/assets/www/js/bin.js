function initBinDetails() {
    API.getBin(getURLParameter("id"), printBinInfo);
    $("*").on("scroll", checkFixedHeader);
}

function printBinInfo(bin) {
    bin = bin.responseJSON;
    console.log(bin);
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
        "background-image": "url(img/" + bin.ImageUrl + ")",
        "background-color": "#82ba73"
    });
    $("#battery-level").css("background-image", "url(img/battery/battery_square_" + batteryImage + ".png)");
    $("#battery-level #battery-status").text(batteryStatus + " (" + Math.round(bin.BatteryLevel) + "%)").css("color", batteryStatusColor);
}

function checkFixedHeader(e) {
    var el = $(".mdl-layout");
    if ($("body").hasClass("fixed")) el = $(".mdl-layout__content");
    var scroll = el.scrollTop();
    console.log(scroll);
    if ($("body").hasClass("scroll") && scroll > 145) {
        $("body").addClass("fixed").removeClass("scroll");
        $(".mdl-layout__header").removeClass("mdl-layout__header--seamed");
        $(".mdl-layout__content").scrollTop(1);
    } else if ($("body").hasClass("fixed") && scroll == 0) {
        $("body").addClass("scroll").removeClass("fixed");
        $(".mdl-layout__header").addClass("mdl-layout__header--seamed");
        $(".mdl-layout").scrollTop(145);
    }
}






