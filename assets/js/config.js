const utils = require('./utils')
const Config = require('electron-config');
const config = new Config();

$(function () {
    // Registramos evento jQuery para el botón #js-save
    $("#js-save").click(function (event) {
        if (validateForm()) {
            let cse = $('#js-cse').val()
            let apiKey = $('#js-api-key').val()
            config.set('cse', cse)
            config.set('api_key', apiKey)
            utils.showSuccess('Configuración Guardada')
        }
    });
    // Cargamos los parámetros de configuración guardados previamente
    $('#js-cse').val(config.get('cse'))
    $('#js-api-key').val(config.get('api_key'))
});

/**
 * Validamos los campos para revisar que todo es correcto
 */
function validateForm() {
    let cse = $('#js-cse').val()
    let apiKey = $('#js-api-key').val()
    let errors = new Array();
    if (!cse) {
        errors.push('Tienes que insertar un CSE ID')
    }
    if (!apiKey) {
        errors.push('Tienes que insertar un API Key')
    }
    if (errors.length) {
        utils.showError(errors.join("<br/>"))
        return false
    }
    return true
}