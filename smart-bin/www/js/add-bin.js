function initAddBin() {
    $(".mdl-layout__content").on("scroll", checkFixedHeader);
    $(".back-button").on("click", back);
    //$("#select-picture-click").on("click", initSelectPicture);
    $(".save-bin").on("click", saveBin);
    API.getBinTypes(printBinTypes);
}

function printBinTypes(bins) {
    var bintypes = "";
    var first = true;
    $.each(bins, function (k, v) {
        bintypes += "<label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect form-item\" for=\"option-" + k + "\">" +
                        "<input type=\"radio\" id=\"option-" + k + "\" class=\"mdl-radio__button\" name=\"bintype\" value=\"" + k + "\"" + (first?" checked=\"checked\"":"") + ">" +
                        "<span class=\"mdl-radio__label\">" + v + "</span>" +
                    "</label>";
        if (first) first = false;
    });
    $(".main-form").append(bintypes);
    componentHandler.upgradeAllRegistered();
}

function saveBin() {
    var name = $("#name").val();
    var type = $("input[name=bintype]:checked").val();
    if (name != "" && typeof name !== typeof undefined && type != "" && typeof type !== typeof undefined) {
        API.registerNewBin(getUserId(), name, type, function (bin) {
            createBin(bin, name, type);
        });
    }
}

function createBin(bin, name, type) {
    console.log(bin);
    console.log(name + " " + type);
    binSuccess(bin.BinId);
}

function binSuccess(binId) {
    saveSnackbar({
        message: "<i class=\"material-icons mdl-color-text--green valign\">check_circle</i><span>Bin saved</span>"
    });
    //location.href = "bin.html?id=" + binId;
}

function initSelectPicture() {
    console.log("pick photo");
    (function() {
        'use strict';
        var dialog = document.querySelector('#select-picture-dialog');
        dialog.MaterialDialog.show(true);
    }());
}









