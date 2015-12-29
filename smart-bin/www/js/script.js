var user;
var reload = true;

function initApp() {
    $.support.cors = true;
    initSnackbar(showSnackbar);
    API.language = "nl";
    API.getUser(getUserId(), "info", saveUser);
    autoreload();
}

function saveUser(output) {
    user = output;
    if ($(".mdl-layout__drawer").length > 0) {
        $("#drawer-user-name").text(user.Name);
        $("#drawer-user-email").text(user.Email);
    }
}

function getUserId() {
    return 2;
}

function truncateText(t, l) {
    if (t.length < l) return t;
    return t.substring(0, l) + "...";
}

function drawerScroll(e) {
    $("#drawer-footer").css("bottom", $(".mdl-layout__drawer").scrollTop() * (-1));
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
} //Source: http://davidmles.com/blog/

function checkFixedHeader(e) {
    var el = $(".mdl-layout__content");
    var scroll = el.scrollTop();
    var limit = 142;
    var opacity = scroll / limit;
    opacity += 0.2;
    if (opacity > 1) opacity = 1;
    var bgColor = $(".scroll-header-container").css("background-color");
    if (bgColor) {
        var bg = $(".header-position-container");
        var newColor = convertColor(bgColor, opacity);
        bg.css("background-color", newColor);
    }
    if ($("body").hasClass("scroll") && scroll > limit) {
        $("body").addClass("fixed").removeClass("scroll");
        $(".mdl-layout__header").removeClass("mdl-layout__header--seamed");
    } else if ($("body").hasClass("fixed") && scroll <= limit) {
        $("body").addClass("scroll").removeClass("fixed");
        $(".mdl-layout__header").addClass("mdl-layout__header--seamed");
        el.scrollTop(limit);
    }
}

function formatCard(card) {
    var defaultCard = {
        button1: true,
        button1Text: "Details",
        button1Link: "#",
        button2: true,
        button2Text: "Klaar",
        button2Link: "#",
        accentColor: "grey-600",
        type: "default",
        cardClasses: "",
        imageColor: "",
        image: ""
    };
    card = $.extend(defaultCard, card);
    var html = "<div id=\"card-" + card.id + "\" class=\"two-to-one card-" + card.type + " " + card.cardClasses + " mdl-card mdl-shadow--2dp\">" +
            "<div class=\"card-content-container\">";
    if (card.type == "timeline") {
        html += "<div class=\"card-time card-content\">" +
                    "<i class=\"material-icons mdl-color-text--" + card.accentColor + "\">" + card.icon + "</i>" +
                    "<span class=\"mdl-color-text--grey-400\">" + card.time + "</span>" +
                "</div>";
    }
    html += "<div class=\"mdl-card__title card-content\">" +
                "<h2 class=\"mdl-card__title-text\">" + card.title + "</h2>" +
            "</div>";
    if (card.type == "timeline") {
        html += "<div class=\"mdl-card__supporting-text card-content\">" + truncateText(card.subtitle, 20) + "</div>";
    } else if (card.type == "bin") {
        html += "<div class=\"mdl-card__supporting-text supporting-text1 card-content\">" + card.subtitle1 + "</div>" +
                "<div class=\"mdl-card__supporting-text supporting-text2 card-content\">" + card.subtitle2 + "</div>";
    }
    html += "<div class=\"mdl-card__actions mdl-card--border card-content\">" +
                (card.button1?"<a href=\"" + card.button1Link + "\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-color-text--" + card.accentColor + " action1-button\">" + card.button1Text + "</a>":"") +
                (card.button2?"<a href=\"" + card.button2Link + "\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--grey-600 action2-button\">" + card.button2Text + "</a>":"") +
            "</div>" +
        "</div>" +
        "<div " + card.imageColor + " class=\"card-image-container\">" +
            "<div " + card.image + " class=\"card-image\">" +
            "</div>" +
        "</div>" +
    "</div>";
    return html;
}

function back() {
    window.history.back();
}

function getNameMonth(monthInt) {
    switch (monthInt) {
        case 1:
            return "Januari";
            break;
        case 2:
            return "Februari";
            break;
        case 3:
            return "Maart";
            break;
        case 4:
            return "April";
            break;
        case 5:
            return "Mei";
            break;
        case 6:
            return "Juni";
            break;
        case 7:
            return "Juli";
            break;
        case 8:
            return "Augustus";
            break;
        case 9:
            return "September";
            break;
        case 10:
            return "Oktober";
            break;
        case 11:
            return "November";
            break;
        case 12:
            return "December";
            break;
        default:
            return "";
            break;
    }
}

function showSnackbar(data) {
    if (typeof data === typeof undefined && typeof localStorage.snackbar !== typeof undefined) data = JSON.parse(localStorage.snackbar);
    if (typeof data !== typeof undefined) {
        $(".mdl-js-snackbar")[0].MaterialSnackbar.showSnackbar(data);
        localStorage.removeItem("snackbar");
    }
}

function saveSnackbar(data) {
    localStorage.snackbar = JSON.stringify(data);
};

function convertColor(color, opacity) {
    var r, g, b;
    if (color.length == 7) {
        var hex = color.replace('#','');
        r = parseInt(hex.substring(0,2), 16);
        g = parseInt(hex.substring(2,4), 16);
        b = parseInt(hex.substring(4,6), 16);
    } else if (color.length > 7) {
        var rgb = color.replace(/^(rgb|rgba)\(/,'').replace(/\)$/,'').replace(/\s/g,'').split(',');
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
    }
    return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
}

function convertBinTypeToClass(type) {
    switch (type) {
        case 0:
            return "waste";
            break;
        case 1:
            return "plastic";
            break;
        case 2:
            return "glass";
            break;
        case 3:
            return "organic";
            break;
        case 4:
            return "tin";
            break;
        case 5:
            return "paper";
            break;
        case 6:
            return "chemical";
            break;
        default:
            return "none";
            break;
    }
}

function getBatteryStatus(batteryLevel) {
    var battery = {};
    battery.batteryStatusColor = "rgb(0, 0, 0)";
    if (batteryLevel <= 10) {
        battery.batteryImage = "5";
        battery.batteryStatus = "Critical";
        battery.batteryStatusColor = "rgb(255, 0, 0)";
    } else if (batteryLevel > 10 && batteryLevel <= 25) {
        battery.batteryImage = "20";
        battery.batteryStatus = "Low";
    } else if (batteryLevel > 25 && batteryLevel <= 40) {
        battery.batteryImage = "30";
        battery.batteryStatus = "Moderate";
    } else if (batteryLevel > 40 && batteryLevel <= 60) {
        battery.batteryImage = "50";
        battery.batteryStatus = "Fine";
    } else if (batteryLevel > 60 && batteryLevel <= 85) {
        battery.batteryImage = "70";
        battery.batteryStatus = "Good";
    } else if (batteryLevel > 85) {
        battery.batteryImage = "100";
        battery.batteryStatus = "High";
    } else {
        battery.batterImage = "100";
        battery.BatteryStatus = "High";
    }
    return battery;
}


function autoreload() {

        var url = 'http://' + document.location.host + '/__api__/autoreload';

        function postStatus() {
            var xhr = new XMLHttpRequest();
            xhr.open('post', url, true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.onreadystatechange = function() {
                if (this.readyState === 4 && /^[2]/.test(this.status)) {
                }
            }
            xhr.send();
        }

        function checkForReload() {
            if (reload) {
                var xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4 && /^[2]/.test(this.status)) {
                        var response = JSON.parse(this.responseText);
                        if (response.content.outdated) {
                            postStatus();
                            window.location.reload();
                        }
                    }
                }
                xhr.send();
            }
        }

        setInterval(checkForReload, 100);

}






