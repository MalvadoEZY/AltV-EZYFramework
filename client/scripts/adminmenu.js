import * as alt from 'alt'
import native from 'natives';

let menuIsOpen = false;
const url = 'http://resource/client/browser/adminmenu/index.html';
let webview;

export async function interfaceStart(playersArray) {
    webview = await new alt.WebView(url);

    if(webview !== null) {
        webview.on('adminmenu:ready', () => {
            menuIsOpen = true;
            alt.toggleGameControls(false);
            webview.focus();
            alt.showCursor(true);
            webview.emit('adminmenu:start', playersArray)
        });
        
        webview.on('adminmenu:reloadplayer', () => {
            alt.emitServer('adminmenu:reloadplayer')
        })
    }    
}


alt.onServer('adminmenu:refreshplayer', (playersArray) => {
    webview.emit('adminmenu:start', playersArray)
})

alt.setInterval(() => {
    if(menuIsOpen) {
        alt.emitServer('adminmenu:reloadplayer')
    }
}, 8000);


alt.on('keydown', (key) => {
    console.log(key)
    //open the window
    if(key === 45 && !menuIsOpen) {
        alt.emitServer('adminmenu:checkplayer')
    }
    
    //closes the window
    if(key === 27 && menuIsOpen) {
        webview.destroy();
        alt.showCursor(false);
        alt.toggleGameControls(true);
        menuIsOpen = false;
    }
})

alt.on('webview:destroyAll', () => {
    if(webview) {
        webview.destroy()
    }
});