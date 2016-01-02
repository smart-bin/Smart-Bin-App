function initAddBin() {
    showLoader();
    $(".mdl-layout__content").on("scroll", checkFixedHeader);
    $(".back-button").on("click", back);
    //$("#select-picture-click").on("click", initSelectPicture);
    $(".save-bin").on("click", saveBin);
    API.getBinTypes(printBinTypes);
    $(".main-form").on("change", "input[type=radio]", changeBinTypeClass);
}

function printBinTypes(bins) {
    var bintypes = "";
    var first = true;
    $.each(bins, function (k, v) {
        bintypes += "<label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect form-item\" for=\"option-" + v.TypeId + "\">" +
                        "<input data-bintypeclass=\"" + convertBinTypeToClass(v.TypeId) + "\" type=\"radio\" id=\"option-" + v.TypeId + "\" class=\"mdl-radio__button\" name=\"bintype\" value=\"" + v.TypeId + "\"" + (first?" checked=\"checked\"":"") + ">" +
                        "<span class=\"mdl-radio__label\">" + v.TypeName + "</span>" +
                    "</label>";
        if (first) first = false;
    });
    $(".main-form").append(bintypes);
    componentHandler.upgradeAllRegistered();
    hideLoader();
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
    binSuccess(bin.BinId);
}

function binSuccess(binId) {
    saveSnackbar({
        message: "<i class=\"material-icons mdl-color-text--green valign\">check_circle</i><span>Bin succesvol toegevoegd</span>"
    });
    history.pushState({}, "bins", "bins.html");
    location.href = "bin.html?id=" + binId;
}

function initSelectPicture() {
    console.log("pick photo");
    (function() {
        'use strict';
        var dialog = document.querySelector('#select-picture-dialog');
        dialog.MaterialDialog.show(true);
    }());
}

function changeBinTypeClass() {
    var el = $(this);
    $("body").removeClass(function (index, css) {
        return (css.match (/(^|\s)bin-type--\S+/g) || []).join(' ');
    }).addClass("bin-type--" + el.data("bintypeclass"));
}









