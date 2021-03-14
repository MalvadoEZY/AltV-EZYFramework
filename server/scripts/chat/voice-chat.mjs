import * as alt from 'alt';

const globalVoice = new alt.VoiceChannel(true, 15);

alt.on('voice:begin', (player) => {
    globalVoice.addPlayer(player);
})
