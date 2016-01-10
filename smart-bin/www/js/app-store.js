function initAppStore() {
    $("#app-store-page .mdl-card").on("click", goToApp);
}

function goToApp() {
    var app = $(this);
    location.href = app.data("href");
}

