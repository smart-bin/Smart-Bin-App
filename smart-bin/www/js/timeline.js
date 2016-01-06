function initTimeline() {
    showLoader();
    getTimelineCards();
    $("#clear-cards").on("click", swipeAllCards);
    $("#timeline-cards").on("click", ".action2-button", function () {
        swipeCard($(this).parents(".mdl-card").attr("id"));
    });
}

function getTimelineCards() {
    var cards = [
        {
            id: 1,
            time: "Nu net",
            title: "Batterij leeg",
            subtitle: "GFT bak",
            notificationType: "warning",
            icon: "warning",
            accentColor: "orange",
            button1Link: "bin.html?id=9",
            cardClasses: "bin-type-card bin-type--organic",
            type: "timeline"
        },
        {
            id: 2,
            time: "1 dag geleden",
            title: "Achievement",
            subtitle: "Recycle minstens 35% van al je afval",
            image: "style=\"background-image: url(img/types/trophy_square.png)\"",
            imageColor: "style=\"background-color: #99d5dd\"",
            notificationType: "achievement",
            icon: "check_circle",
            accentColor: "green",
            button1Link: "achievements.html",
            type: "timeline"
        },
        {
            id: 3,
            time: "10 dagen geleden",
            title: "Bin toegevoegd",
            subtitle: "Papierbak",
            notificationType: "added",
            icon: "add_circle",
            accentColor: "green",
            button1Link: "bin.html?id=11",
            cardClasses: "bin-type-card bin-type--paper",
            type: "timeline"
        },
        {
            id: 4,
            time: "28 dagen geleden",
            title: "Bin toegevoegd",
            subtitle: "Restafval",
            notificationType: "added",
            icon: "add_circle",
            accentColor: "green",
            button1Link: "bin.html?id=3",
            cardClasses: "bin-type-card bin-type--waste",
            type: "timeline"
        }
    ];
    showLoader(cards.length);
    printTimelineCards(cards);
}

function printTimelineCards(cards) {
    var cardsHTML = "";
    $.each(cards, function (k, card) {
        cardsHTML += formatCard(card);
        hideLoader();
    });
    $("#timeline-cards").append(cardsHTML);
    $(".mdl-card").on("swiperight", function (e) {
        var el = $(e.target);
        var id;
        if (el.hasClass("mdl-card")) {
            id = el.attr("id");
        } else if (el.parents(".mdl-card").length > 0) {
            id = el.parents(".mdl-card").attr("id");
        }
        swipeCard($(this).attr("id"));
    });
}





