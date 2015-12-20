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
            image: "img/types/trophy_square.png",
            imageColor: "#99d5dd",
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
            image: "img/types/paper_square.png",
            imageColor: "#eb5151",
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
            image: "img/types/waste_square.png",
            imageColor: "#efc51e",
            type: "added",
            icon: "add_circle",
            accentColor: "green",
            button1Link: "bin.html?id=3",
            type: "timeline"
        },
    ];
    $.each(cards, function (k, card) {
        $("#timeline-cards").append(formatCard(card));
    });
}





