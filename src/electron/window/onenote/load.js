const {ipcRenderer} = require('electron');

const Store = require('electron-store');
const conf = new Store();
let translationKey = conf.get('lang')
const langTranslations = {
    'en-US': require('../../../translation/en-US'),
    'de-DE': require('../../../translation/de-DE'),
    'pt-BR': require('../../../translation/pt-BR'),
    'es-ES': require('../../../translation/es-ES'),
    'fr-FR': require('../../../translation/fr-FR'),
    'nl-NL': require('../../../translation/nl-NL'),
    'it-IT': require('../../../translation/it-IT'),
    'zh-CN': require('../../../translation/zh-CN'),
    'ru-RU': require('../../../translation/ru-RU'),
    'pl-PL': require('../../../translation/pl-PL'),
    'tr-TR': require('../../../translation/tr-TR'),
}
if (!translationKey) {
    translationKey = 'en-US'
}
const translation = langTranslations[translationKey]

global.p3x = {
    onenote: {
        conf: conf,
        domReady: false,
        url: {
            /*
            https://www.onenote.com/notebooks?omkt=en-US
            https://www.onenote.com/notebooks?omkt=de-DE
            https://www.onenote.com/notebooks?omkt=hu-HU
            */
            notebooks: 'https://www.onenote.com/notebooks',
        },
        ui: {},
        hackCss: undefined,
        ng: undefined,
        webview: undefined,
        pkg: require('../../../../package'),
        translations: langTranslations,
        lang: translation,
        data: {
            url: 'about:blank',
            proxy: '',
        },
        prompt: undefined,
        toast: undefined,
        root: undefined,
        wrongUrlTimeout: 1000,
        wrongUrlMaxAllowed: 5,
        wait: {
            angular: (cb) => {
                let timeout
                const exec = () => {
                    if (global.p3x.onenote.root === undefined) {
                        clearTimeout(timeout)
                        timeout = setTimeout(exec, 250)
                    } else {
                        cb()
                    }
                }
                exec()
            },
            domReady: async () => {
                return new Promise(resolve => {
                    let timeout
                    const exec = () => {
                        if (p3x.onenote.domReady !== true) {
                            clearTimeout(timeout)
                            timeout = setTimeout(exec, 250)
                        } else {
                            resolve()
                        }
                    }
                    exec()
                })
            }
        }
    }
}


document.title = `${global.p3x.onenote.lang.title} v${global.p3x.onenote.pkg.version}`;

window.p3xOneNoteOnLoad = function () {

    if (conf.get('darkThemeInvert') === true) {
        document.body.classList.add('p3x-dark-mode-invert-quirks')
    }

    const webview = document.getElementById("p3x-onenote-webview");
    global.p3x.onenote.webview = webview;
    webview.focus()

    /*
    global.p3x.onenote.webview.addEventListener("dom-ready", function () {
//require('./core/overlay')
        require('./angular')
    })
     */

    const ipcHandler = require('./ipc/handler');
    ipcHandler({
        webview: webview,
    })

    const eventHandler = require('./event/handler');
    eventHandler({
        webview: webview,
    })

    ipcRenderer.send('did-finish-load');
}

