var user;

function initApp() {
    $.support.cors = true;
    API.getUser(getUserId(), "info", saveUser);
    // $(".mdl-layout__drawer").on("scroll", drawerScroll);
}

function saveUser(output) {
    user = output;
    $("#drawer-user-name").text(user.Name);
    $("#drawer-user-email").text(user.Email);
}

function getUserId() {
    return 7;
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
} //Bron: http://davidmles.com/blog/

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