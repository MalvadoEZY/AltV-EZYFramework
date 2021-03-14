
import * as alt from 'alt';
import * as native from 'natives';

alt.on('disconnect', () => {
    native.destroyAllCams(true);
    native.displayRadar(false);
    native.renderScriptCams(false, false, 0, false, false);
    native.triggerScreenblurFadeOut(0);

    alt.emit('webview:destroyAll');
});