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
            image: "style=\"background-image: url(img/types/glass_square.png)\"",
            imageColor: "style=\"background-color: #82ba73\"",
            type: "warning",
            icon: "warning",
            accentColor: "orange",
            button1Link: "bin.html?id=5",
            type: "timeline"
        },
        {
            id: 2,
            time: "1 dag geleden",
            title: "Achievement",
            subtitle: "Recycle minstens 35% van al je afval",
            image: "style=\"background-image: url(img/types/trophy_square.png)\"",
            imageColor: "style=\"background-color: #99d5dd\"",
            type: "achievement",
            icon: "check_circle",
            accentColor: "green",
            button1Link: "achievements.html",
            type: "timeline"
        },
        {
            id: 3,
            time: "10 dagen geleden",
            title: "Bin toegevoegd",
            subtitle: "Papier",
            image: "style=\"background-image: url(img/types/paper_square.png)\"",
            imageColor: "style=\"background-color: #eb5151\"",
            type: "added",
            icon: "add_circle",
            accentColor: "green",
            button1Link: "bin.html?id=2",
            type: "timeline"
        },
        {
            id: 4,
            time: "28 dagen geleden",
            title: "Bin toegevoegd",
            subtitle: "Restafval",
            image: "style=\"background-image: url(img/types/waste_square.png)\"",
            imageColor: "style=\"background-color: #efc51e\"",
            type: "added",
            icon: "add_circle",
            accentColor: "green",
            button1Link: "bin.html?id=3",
            type: "timeline"
        },
    ];
    printTimelineCards(cards);
}

function printTimelineCards(cards) {
    $("#loader.spinner").hide();
    var cardsHTML = "";
    $.each(cards, function (k, card) {
        cardsHTML += formatCard(card);
    });
    $("#timeline-cards").append(cardsHTML);
}





