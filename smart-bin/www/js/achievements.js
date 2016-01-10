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
    var achievementCardsDone = "";
    var achievementCardsInProgress = "";
    var generatedCardIds = [];
    $.each(achievements.achievements, function (k, v) {
        v.id = k + 1;
        var card = formatAchievementCard(v);
        if (v.value == 100) achievementCardsDone += card;
        else achievementCardsInProgress += card;
        generatedCardIds.push(v.id);
    });
    $("#achievements-done .achievements").append(achievementCardsDone);
    $("#achievements-in-progress .achievements").append(achievementCardsInProgress);
    hideLoader();
    loadPies("#achievements-in-progress");
    $("#in-progress-button").on("click", function () {
        loadPies("#achievements-in-progress");
    });
    $("#done-button").on("click", function () {
        loadPies("#achievements-done");
    });
}

function loadPies(section) {
    var timeout = 0;
    $.each($(section + " .mdl-card:not(.init-done)"), function (k, v) {
        var card = $(v);
        printAchievementGraph("#" + card.attr("id"), card.data("pie-value"), timeout);
        card.addClass("init-done");
        timeout += 500;
    });
}

function formatAchievementCard(card) {
    var html = "<div id=\"card-" + card.id + "\" class=\"two-to-one card-achievement mdl-card mdl-shadow--2dp\" data-pie-value=\"" + card.value + "\">" +
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
    var pieBgEl = $(id + " canvas.pie-background")[0].getContext("2d");
    var pieEl = $(id + " canvas.pie-achievement")[0].getContext("2d");
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
    $(id + " .card-achievement-graph-inner").height($(id + " canvas.pie-background").height());
    setTimeout(function() {
        var myDoughnutChart = new Chart(pieEl).Doughnut(pie, {
            segmentShowStroke: false,
            percentageInnerCutout: 80
        });
    }, timeout);
}