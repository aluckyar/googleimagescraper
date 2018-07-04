const electron = require('electron')
const { dialog } = electron.remote
const fs = require('fs')
const request = require('request')
const gis = require('./google-image-search')
const utils = require('./utils')

$(function () {
    // Seleccionamos la carpeta de destino para las imágenes obtenidas
    $("#js-file-chooser").click(function (event) {
        let fileChooser = dialog.showOpenDialog({ properties: ['openDirectory'] })
        if (fileChooser) {
            $("#js-destiny").val(fileChooser[0]);
        }
    });

    // Ejecutamos el proceso
    $("#js-execute").click(function (event) {
        if (validateForm()) {
            searchImages()
        }
    });
});

/**
 * Función que principal que realiza la búsqueda de imágenes 
 */
function searchImages() {
    let destiny = $('#js-destiny').val()
    let search = $('#js-search').val()
    let $progressBar = $('.progress-bar')
    let contDownload = 1
    let numImgs = 0
    startUi()
    logConsole('Iniciando proceso ...')
    gis.searchImage(search)
        .then(images => {
            if (images.length) {
                numImgs = images.length
                let cont = 1
                images.forEach(function (img) {
                    let type = img['type'].split('/')
                    downloadImage(img['url'], destiny + '/' + cont + '.' + type[1], function () {
                        let por = (contDownload * 100) / numImgs
                        por = Math.round(por * 100) / 100
                        $progressBar.css('width', por + '%').html(por + '%')
                        logConsole('Imagen Guardada ' + contDownload)
                        if (numImgs == contDownload) {
                            logConsole('Proceso finalizado')
                            showSuccess('<b>Proceso finalizado</b>. Compruebe su carpeta de destino para ver las imágenes descargadas')
                            stopUi()
                        }
                        contDownload++
                    })
                    cont++
                });
                writeImagesLog(images)

            }
        }).catch(function (err) {
            stopUi()
            logConsole("Error: " + err);
            showError('Ha habido un error en el proceso de descarga de las Imágenes')
        });
}

/**
 * Guardamos el log de imágenes descargadas
 * @param {*} images 
 */
function writeImagesLog(images) {
    let destiny = $('#js-destiny').val()
    images.forEach(function (img) {
        fs.appendFile(destiny + '/images.log', JSON.stringify(img) + "\n")
    });
}

/**
 * Validamos los campos para revisar que todo es correcto
 */
function validateForm() {
    let cse = $('#js-cse').val()
    let apiKey = $('#js-api-key').val()
    let destiny = $('#js-destiny').val()
    let search = $('#js-search').val()
    let errors = new Array();
    if (!cse) {
        errors.push('Tienes que insertar un CSE ID')
    }
    if (!apiKey) {
        errors.push('Tienes que insertar un API Key')
    }
    if (!destiny) {
        errors.push('Tienes que elegir una carpeta de destino')
    }
    if (!search) {
        errors.push('Tienes que introducir un término de búsqueda')
    }
    if (errors.length) {
        showError(errors.join("<br/>"))
        return false
    }
    return true
}

/**
 * Arrancamos el proceso desactivando y mostrando los elementos necesarios
 */
function startUi() {
    $('.form-app input').attr('disabled', 'disabled')
    $('.form-app button').attr('disabled', 'disabled')
    $('#js-success').hide();
    $('#js-danger').hide();
    $('#js-log').val('')
    $('#js-log').show()
    $('.loader').show();
    $('.progress-bar').css('width', '0%').html('0%')
    $('.progress').show()
}

/**
 * Paramos el proceso ocultando la barra de progreso
 */
function stopUi() {
    $('.form-app input').removeAttr('disabled', 'disabled')
    $('.form-app button').removeAttr('disabled', 'disabled')
    $('.loader').hide()
    $('.progress').hide()
}

/**
 * Función para descargar las imágenes scrapeadas
 * @param {*} uri 
 * @param {*} filename 
 * @param {*} callback 
 */
function downloadImage(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
    });
}

/**
 * Función que muestra los errores
 * @param {*} msg 
 */
function showError(msg) {
    utils.showError(msg)
}

/**
 * Función que muestra los mensages de success
 * @param {*} msg 
 */
function showSuccess(msg) {
    utils.showSuccess(msg)
}

/**
 * Función que loguea en consola y en textarea
 * @param {*} msg 
 */
function logConsole(msg) {
    let log = $('#js-log').val();
    $('#js-log').val(formatDate() + ' ' + msg + "\n" + log)
    console.log(msg)
}

/**
 * Función para formatear date en dd/mm/yyyy
 * @param {*} date 
 */
function formatDate() {
    var date = new Date()
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var sec = date.getSeconds()
    var strTime = hours + ':' + minutes + ':' + sec;
    return date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear() + "  " + strTime;
}