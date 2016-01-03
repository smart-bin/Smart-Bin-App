function initTimeline() {
    showLoader();
    getTimelineCards();
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
    printTimelineCards(cards);
}

function printTimelineCards(cards) {
    var cardsHTML = "";
    $.each(cards, function (k, card) {
        cardsHTML += formatCard(card);
    });
    $("#timeline-cards").append(cardsHTML);
    hideLoader();
}





