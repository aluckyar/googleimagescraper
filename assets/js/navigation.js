const utils = require('./utils')

$(function () {
    // Control en el click de cada elemento del menú
    $('.nav-link').click(function (event) {
        $('#js-success').hide();
        $('#js-danger').hide();
        $('#js-warning').hide();
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        var element = $(this).data('element');
        $('.content').hide();
        $('.' + element).show();
    });

    $('.link').click(function (event) {
        event.preventDefault();
        utils.openExternal($(this).attr('href'))
        return false;
    });
});