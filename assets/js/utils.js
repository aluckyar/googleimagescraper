const fs = require('fs')
const { shell } = require('electron')
module.exports = class Utils {
    /**
     * Función que muestra los errores
     * @param {*} msg 
     */
    static showError(msg) {
        this.clearMsg()
        let $danger = $('#js-danger')
        $danger.show()
        $danger.html(msg)
    }

    /**
     * Función que muestra los mensages de success
     * @param {*} msg 
     */
    static showSuccess(msg) {
        this.clearMsg()
        let $success = $('#js-success')
        $success.show()
        $success.html(msg)
    }

    /**
     * Función que muestra los mensages de warning
     * @param {*} msg 
     */
    static showWarning(msg) {
        this.clearMsg()
        let $warning = $('#js-warning')
        $warning.show()
        $warning.html(msg)
    }

    /**
     * Función que borra los mensajes anteriores
     */
    static clearMsg() {
        let $success = $('#js-success')
        let $danger = $('#js-danger')
        let $warning = $('#js-warning')
        $success.empty();
        $danger.empty();
        $warning.hide();
        $success.hide();
        $danger.hide();
        $warning.hide();
    }

    static openExternal(link) {
        shell.openExternal(link)
    }
};