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

