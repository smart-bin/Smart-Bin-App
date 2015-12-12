function initTimeline() {
    getTimelineCards();
}

function getTimelineCards() {
    var cards = [
        {
            id: 1,
            time: "Nu net",
            title: "Batterij leeg",
            subtitle: "Glas",
            image: "img/types/glass_square.png",
            imageColor: "#82ba73",
            link: "bin.html?id=5",
            type: "warning",
            icon: "warning",
            accentColor: "orange"
        },
        {
            id: 2,
            time: "1 dag geleden",
            title: "Achievement",
            subtitle: "Recycle minstens 35% van al je afval",
            image: "img/types/trophy_square.png",
            imageColor: "#99d5dd",
            link: "achievements.html",
            type: "achievement",
            icon: "check_circle",
            accentColor: "green"
        },
        {
            id: 3,
            time: "10 dagen geleden",
            title: "Bin toegevoegd",
            subtitle: "Papier",
            image: "img/types/paper_square.png",
            imageColor: "#eb5151",
            link: "bin.html?id=2",
            type: "added",
            icon: "add_circle",
            accentColor: "green"
        },
        {
            id: 4,
            time: "28 dagen geleden",
            title: "Bin toegevoegd",
            subtitle: "Restafval",
            image: "img/types/waste_square.png",
            imageColor: "#efc51e",
            link: "bin.html?id=3",
            type: "added",
            icon: "add_circle",
            accentColor: "green"
        },
    ];
    printTimelineCards(cards);
}

function printTimelineCards(cards) {
    var cardsHTML = "";
    $.each(cards, function (k, card) {
        cardsHTML += "<div id=\"card-" + card.id + "\" class=\"two-to-one mdl-card mdl-shadow--2dp\">" +
                        "<div class=\"card-content-container\">" +
                            "<div class=\"card-time card-content\">" +
                                "<i class=\"material-icons mdl-color-text--" + card.accentColor + "\">" + card.icon + "</i>" +
                                "<span class=\"mdl-color-text--grey-400\">" + card.time + "</span>" +
                            "</div>" +
                            "<div class=\"mdl-card__title card-content\">" +
                                "<h2 class=\"mdl-card__title-text\">" + card.title + "</h2>" +
                            "</div>" +
                            "<div class=\"mdl-card__supporting-text card-content\">" + truncateText(card.subtitle, 20) + "</div>" +
                            "<div class=\"mdl-card__actions mdl-card--border card-content\">" +
                                "<a href=\"" + card.link + "\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-color-text--" + card.accentColor + "\">Details</a>" +
                                "<button class=\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--grey-600 dismiss-button\">Klaar</button>" +
                            "</div>" +
                        "</div>" +
                        "<div style=\"background-color: " + card.imageColor + ";\" class=\"card-image-container\">" +
                            "<div style=\"background-image: url(" + card.image + ");\" class=\"card-image\">" +
                            "</div>" +
                        "</div>" +
                    "</div>";
    });
    $("#timeline-cards").append(cardsHTML);
    // $.each($(".two-to-one.mdl-card"), function () {
    //     $(this).height($(this).find(".card-image img").height());
    // })
}





