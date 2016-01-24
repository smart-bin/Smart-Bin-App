var user;
var reload = true;
var loaderTimeout;
var loaderCount = 0;
var dev = false;

function initApp() {
    $.support.cors = true;
    initSnackbar(showSnackbar);
    API.language = "nl";
    API.getUser(getUserId(), "info", saveUser);
    if (dev) autoreload();
}

function saveUser(output) {
    user = output;
    if ($(".mdl-layout__drawer").length > 0) {
        $("#drawer-user-name").text(user.Name);
        $("#drawer-user-email").text(user.Email);
    }
}

function getUserId() {
    if (typeof localStorage.userId === typeof undefined) return 2;
    else return localStorage.userId;
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
} //Source: http://davidmles.com/blog/

function checkFixedHeader(e) {
    var content = $(".mdl-layout__content");
    var scroll = content.scrollTop();
    var limit = 143;
    var margin = 1.2;
    var percentage = scroll / limit;
    percentage *= margin;
    var opacity = percentage;
    if (opacity > 1) opacity = 1;
    var bgColor = $(".scroll-header-container").css("background-color");
    if (bgColor) {
        var bg = $(".header-position-container");
        var newColor = convertColor(bgColor, opacity);
        bg.css("background-color", newColor);
    }
    var heading = $(".scroll-header .scroll-header-container h1");
    var form = $(".scroll-header .scroll-header-container form");
    var headerEl = heading.length > 0 ? heading : form;
    if (headerEl.length > 0) {
        var marginLeft = 16;
        var maxLeft = 56;
        var resultWidth = 58;
        var initWidth = 90;
        var left = (maxLeft - marginLeft) * percentage + marginLeft;
        var width = initWidth - ((initWidth - resultWidth) * percentage);
        if (left > maxLeft) left = maxLeft;
        if (width < resultWidth) width = resultWidth;
        headerEl.css({
            width: width + "%",
            transform: "translate3d(" + left + "px, 0, 0)"
        });
    }
    if ($("body").hasClass("scroll") && scroll > limit) {
        $("body").addClass("fixed").removeClass("scroll");
        $(".mdl-layout__header").removeClass("mdl-layout__header--seamed");
    } else if ($("body").hasClass("fixed") && scroll <= limit) {
        $("body").addClass("scroll").removeClass("fixed");
        $(".mdl-layout__header").addClass("mdl-layout__header--seamed");
        content.scrollTop(limit);
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
                "<h2 class=\"mdl-card__title-text ellipsis\">" + card.title + "</h2>" +
            "</div>";
    if (card.type == "timeline") {
        html += "<div class=\"mdl-card__supporting-text card-content ellipsis\">" + card.subtitle + "</div>";
    } else if (card.type == "bin") {
        html += "<div class=\"mdl-card__supporting-text supporting-text1 card-content ellipsis\">" + card.subtitle1 + "</div>" +
                "<div class=\"mdl-card__supporting-text supporting-text2 card-content ellipsis\">" + card.subtitle2 + "</div>";
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

function back(e) {
    if (typeof e.data != "undefined" && typeof e.data.url != "undefined") location.href = e.data.url;
    else History.back();
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
}

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

function convertBinType(type) {
    switch (type) {
        case 0:
            return {class: "waste", color: "rgba(239, 197, 30, 1)"};
        case 1:
            return {class: "plastic", color: "rgba(33, 150, 243, 1)"};
        case 3:
            return {class: "organic", color: "rgba(130, 186, 115, 1)"};
        case 5:
            return {class: "paper", color: "rgba(235, 81, 81, 1)"};
        default:
            return {class: "none", color: "transparent"};
    }
}

function showLoader(count) {
    clearTimeout(loaderTimeout);
    if (typeof count === typeof undefined) count = 1;
    loaderCount = count;
    var spinner = $("#loader.spinner");
    spinner.addClass("show");
    spinner.removeClass("hidden");
    loaderTimeout = setTimeout(function () {
        spinner.removeClass("show");
        spinner.removeClass("hide");
    }, 300);
}

function hideLoader() {
    if (loaderCount === 1) {
        clearTimeout(loaderTimeout);
        var spinner = $("#loader.spinner");
        spinner.addClass("hide");
        loaderTimeout = setTimeout(function () {
            spinner.addClass("hidden");
        }, 300);
    } else {
        loaderCount--;
    }
}

function swipeCard(id, multiple) {
    if (typeof multiple === typeof undefined) multiple = false;
    var card = $("#" + id);
    card.css("transform", "translate3d(" + (card.width() + parseInt($(".page-content").css("padding"))) + "px, 0, 0)");
    if (!multiple) {
        setTimeout(function () {
            card.css("height", card.height() + "px");
            setTimeout(function () {
                card.addClass("hide");
                if ($(".mdl-card:not(.hide, #no-more-cards)").length == 0) {
                    $("#no-more-cards").removeClass("hidden");
                    $("#clear-cards").addClass("mdl-button--disabled");
                }
                setTimeout(function () {
                    card.addClass("hidden");
                }, 300);
            }, 100);
        }, 200);
    }
}

function swipeAllCards() {
    var timeout = 0;
    var cards = $(".mdl-card").not("#no-more-cards");
    $.each(cards, function (k, v) {
        setTimeout(function () {
            swipeCard($(v).attr("id"), true);
            if (k == cards.length - 1) {
                $("#no-more-cards").removeClass("hidden");
                $("#clear-cards").addClass("mdl-button--disabled");
            }
        }, timeout);
        timeout += 100;
    });
}

function getBatteryStatus(batteryLevel) {
    var battery = {};
    battery.batteryStatusColor = "rgba(255, 255, 255, 1)";
    if (batteryLevel <= 10) {
        battery.batteryImage = "5";
        battery.batteryStatus = "Critical";
        battery.batteryStatusColor = "rgba(255, 0, 0, 1)";
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






