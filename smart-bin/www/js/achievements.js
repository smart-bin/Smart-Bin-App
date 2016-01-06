function initAchievements() {
    showLoader();
    getAchievements();
}

function getAchievements() {
    $.ajax({
        url: "http://ianwensink.nl/dev/hr/internetfornature/achievements.php",
        data: {
            userId: getUserId()
        },
        dataType: "json",
        success: formatAchievementsCards
    })
}

function formatAchievementsCards(achievements) {
    var achievementCards = "";
    var generatedCardIds = [];
    $.each(achievements.achievements, function (k, v) {
        v.id = k + 1;
        var card = formatAchievementCard(v);
        achievementCards += card;
        generatedCardIds.push(v.id);
    });
    $("#achievements").append(achievementCards);
    showLoader(achievements.achievements.length);
    var timeout = 0;
    $.each(achievements.achievements, function (k, v) {
        printAchievementGraph(k + 1, v.value, timeout);
        timeout += 500;
    });
}

function formatAchievementCard(card) {
    var html = "<div id=\"card-" + card.id + "\" class=\"two-to-one card-achievement mdl-card mdl-shadow--2dp\">" +
                    "<div class=\"card-content-container valign\">" +
                        "<div class=\"mdl-card__title card-content\">" +
                            "<h2 class=\"mdl-card__title-text ellipsis\">" + card.title + "</h2>" +
                        "</div>" +
                        "<div class=\"mdl-card__supporting-text\">" + card.description + "</div>" +
                    "</div>" +
                    "<div class=\"card-achievement-graph-container\">" +
                        "<div class=\"card-achievement-graph-inner\">" +
                            "<canvas class=\"pie-background\"></canvas>" +
                            "<canvas class=\"pie-achievement\"></canvas>" +
                        "</div>" +
                        "<span class=\"centerab value-text\">" + card.value + "%</span>" +
                    "</div>" +
                "</div>";
    return html;
}

function printAchievementGraph(id, value, timeout) {
    var pieBgEl = $("#card-" + id + " canvas.pie-background")[0].getContext("2d");
    var pieEl = $("#card-" + id + " canvas.pie-achievement")[0].getContext("2d");
    var backgroundColor = "rgba(0, 0, 0, 0.08)";
    var primaryColor = $(".mdl-layout__header").css("background-color");
    var pieBg = [{
        value: 100,
        color: backgroundColor,
        highlight: backgroundColor
    }];
    var pie = [{
        value: value,
        color: primaryColor,
        highlight: primaryColor,
        label: "Done"
    }, {
        value: 100 - value,
        color: "transparent",
        highlight: "transparent"
    }];
    var myDoughnutChartBackground = new Chart(pieBgEl).Doughnut(pieBg, {
        segmentShowStroke: false,
        animateRotate: false,
        percentageInnerCutout: 80
    });
    $("#card-" + id + " .card-achievement-graph-inner").height($("#card-" + id + " canvas.pie-background").height());
    setTimeout(function() {
        var myDoughnutChart = new Chart(pieEl).Doughnut(pie, {
            segmentShowStroke: false,
            percentageInnerCutout: 80
        });
    }, timeout);
    hideLoader();
}