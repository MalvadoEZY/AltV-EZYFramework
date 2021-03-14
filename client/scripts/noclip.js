
import alt from 'alt-client';
import * as native from 'natives';

const timeBetweenPlayerUpdates = 250;

let nextUpdate = Date.now() + 50;
let showHud = true;
let maxSpeed = 0.5;
let speed = 0;
let zSpeedUp = 0;
let zSpeedDown = 0;
let interval;
let cam;
let coords;

const temporaryText = [];
alt.onServer('noclip:teleportUpdate', playerTeleported);

function playerTeleported(position) {
    native.destroyAllCams();

    coords = position;
    cam = native.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', coords.x, coords.y, coords.z, 0, 0, 0, 90);
    native.setCamActive(cam, true);
    native.renderScriptCams(true, false, 0, true, false);
    native.setCamAffectsAiming(cam, false);
}
 function addTemporaryText(identifier, msg, x, y, scale, r, g, b, a, ms) {
    const index = temporaryText.findIndex(data => data.identifier === identifier);

    if (index !== -1) {
        try {
            alt.clearTimeout(temporaryText[index].timeout);
        } catch (err) {}
        temporaryText.splice(index, 1);
    }

    const timeout = alt.setTimeout(() => {
        removeText(identifier);
    }, ms);

    temporaryText.push({ identifier, msg, x, y, scale, r, g, b, a, timeout });
}

function removeText(identifier) {
    const index = temporaryText.findIndex(data => data.identifier === identifier);
    if (index <= -1) {
        return;
    }

    temporaryText.splice(index, 1);
}

alt.everyTick(() => {
    for (let i = 0; i < temporaryText.length; i++) {
        const data = temporaryText[i];
        native.beginTextCommandDisplayText('STRING');
        native.addTextComponentSubstringPlayerName(data.msg);
        native.setTextFont(4);
        native.setTextScale(1, data.scale);
        native.setTextWrap(0.0, 1.0);
        native.setTextCentre(true);
        native.setTextColour(data.r, data.g, data.b, data.a);
        native.setTextJustification(0);
        native.setTextOutline();
        native.endTextCommandDisplayText(data.x, data.y);
    }
});


 function getCrossProduct(v1, v2) {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    };
}

 function getNormalizedVector(vector) {
    const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    return {
        x: vector.x / mag,
        y: vector.y / mag,
        z: vector.z / mag
    };
}

 function degToRad(degrees) {
    return (degrees * Math.PI) / 180;
}

 function rotationToDirection(rotation) {
    const z = degToRad(rotation.z);
    const x = degToRad(rotation.x);
    const num = Math.abs(Math.cos(x));

    return {
        x: -Math.sin(z) * num,
        y: Math.cos(z) * num,
        z: Math.sin(x)
    };
}

 function getCameraRotation(cam) {
    return { ...native.getCamRot(cam, 2) };
}

 function getCameraPosition(cam) {
    return { ...native.getCamCoord(cam) };
}

const disabledControls = [
    30, // A & D
    31, // W & S
    21, // Left Shift
    36, // Left Ctrl
    22, // Space
    44, // Q
    38, // E
    71, // W - Vehicle
    72, // S - Vehicle
    59, // A & D - Vehicle
    60, // L Shift & L CTRL - Vehicle
    42, // D PAD Up || ]
    43, // D PAD Down || [
    85,
    86,
    15, // Mouse Wheel Up
    14, // Mouse Wheel Down
    228,
    229,
    172,
    173,
    37,
    44,
    178,
    244,
    220,
    221,
    218,
    219,
    16,
    17
];

alt.on('syncedMetaChange', (entity, key, value) => {
    if (entity !== alt.Player.local) {
        return;
    }

    if (key !== 'FREECAM') {
        return;
    }

    if (!value) {
        if (interval) {
            alt.clearInterval(interval);
            interval = null;
        }

        if (cam) {
            native.renderScriptCams(false, false, 255, true, false);
            native.setCamActive(cam, false);
            native.destroyCam(cam, false);
            native.destroyAllCams(true);
            cam = null;
        }

        native.resetEntityAlpha(alt.Player.local.scriptID);
        native.freezeEntityPosition(alt.Player.local.scriptID, false);
        native.setEntityInvincible(alt.Player.local.scriptID, false);
        addTemporaryText(`freecamStatus`, `Freecam: Off`, 0.95, 0.2, 0.4, 255, 255, 255, 255, 2000);
        return;
    }

    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    native.setEntityInvincible(alt.Player.local.scriptID, true);
    interval = alt.setInterval(handleCamera, 0);
    addTemporaryText(`freecamStatus`, `Freecam: On`, 0.95, 0.2, 0.4, 255, 255, 255, 255, 2000);
});

alt.everyTick(() => {
    const players = [...alt.Player.all];

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (!player || !player.valid) {
            continue;
        }

        if (player.getSyncedMeta('FREECAM')) {
            native.setEntityAlpha(player.scriptID, 0, false);
        } else {
            native.resetEntityAlpha(player.scriptID);
        }
    }
});

function handleCamera() {
    if (native.isPauseMenuActive()) {
        return;
    }

    if (!showHud) {
        native.hideHudAndRadarThisFrame();
    }

    if (!cam) {
        native.destroyAllCams();

        coords = { ...alt.Player.local.pos };
        cam = native.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', coords.x, coords.y, coords.z, 0, 0, 0, 90);
        native.setCamActive(cam, true);
        native.renderScriptCams(true, false, 0, true, false);
        native.setCamAffectsAiming(cam, false);
    }

    for (let i = 0; i < disabledControls.length; i++) {
        const disabledControl = disabledControls[i];
        native.disableControlAction(0, disabledControl, true);
    }

    native.disableFirstPersonCamThisFrame();
    native.blockWeaponWheelThisFrame();

    // 38 - E
    if (native.isDisabledControlPressed(0, 38)) {
        if (zSpeedUp < maxSpeed) {
            zSpeedUp = zSpeedUp += 0.02 * (zSpeedUp + 0.01);
        }
    } else {
        if (zSpeedUp > 0) {
            zSpeedUp = zSpeedUp -= 0.02 * (zSpeedUp + 0.01);
        }
    }

    // 44 - Q
    if (native.isDisabledControlPressed(0, 44)) {
        if (zSpeedDown < maxSpeed) {
            zSpeedDown = zSpeedDown += 0.02 * (zSpeedDown + 0.01);
        }
    } else {
        if (zSpeedDown > 0) {
            zSpeedDown = zSpeedDown -= 0.02 * (zSpeedDown + 0.01);
        }
    }

    // 14 - Scroll Down - DPAD Right
    if (native.isDisabledControlJustPressed(0, 14)) {
        maxSpeed += 0.1;
        maxSpeed = parseFloat(maxSpeed.toFixed(2));

        if (maxSpeed >= 4.0) {
            maxSpeed = 4.0;
        }

        addTemporaryText(`speed`, `Velocidade: ${maxSpeed}`, 0.95, 0.05, 0.4, 255, 255, 255, 255, 2000);
    }

    // 15 - Scroll Up - DPAD Left
    if (native.isDisabledControlJustPressed(0, 15)) {
        maxSpeed -= 0.1;
        maxSpeed = parseFloat(maxSpeed.toFixed(2));

        if (maxSpeed <= 0.01) {
            maxSpeed = 0.01;
        }

        addTemporaryText(`speed`, `Velocidade: ${maxSpeed}`, 0.95, 0.05, 0.4, 255, 255, 255, 255, 2000);
    }

    // A + D - Right Control Stick
    const rightAxisX = native.getDisabledControlNormal(0, 220);
    const rightAxisY = native.getDisabledControlNormal(0, 221);

    // W + S - Left Control Stick
    const leftAxisX = native.getDisabledControlNormal(0, 218);
    const leftAxisY = native.getDisabledControlNormal(0, 219);

    // Smooth Out Speed Controls
    if (leftAxisX === 0 && leftAxisY === 0) {
        speed = 0;
    } else {
        if (speed < maxSpeed) {
            speed += 0.15 * (speed + 0.05);
        }
    }

    if (speed > maxSpeed) {
        speed -= 0.05 * (speed + 0.01);
    }

    // Calculations
    const upVector = { x: 0, y: 0, z: 1 };
    const pos = getCameraPosition(cam);
    const rot = getCameraRotation(cam);
    const rr = rotationToDirection(rot);
    const preRightVector = getCrossProduct(getNormalizedVector(rr), getNormalizedVector(upVector));

    const movementVector = {
        x: rr.x * leftAxisY * speed,
        y: rr.y * leftAxisY * speed,
        z: rr.z * leftAxisY * (speed / 1.5)
    };

    const rightVector = {
        x: preRightVector.x * leftAxisX * speed,
        y: preRightVector.y * leftAxisX * speed,
        z: preRightVector.z * leftAxisX * speed
    };

    const newPos = {
        x: pos.x - movementVector.x + rightVector.x,
        y: pos.y - movementVector.y + rightVector.y,
        z: pos.z - movementVector.z + rightVector.z + zSpeedUp - zSpeedDown
    };

    native.setCamCoord(cam, newPos.x, newPos.y, newPos.z);
    native.setCamRot(cam, rot.x + rightAxisY * -5.0, 0.0, rot.z + rightAxisX * -5.0, 2);

    if (Date.now() > nextUpdate) {
        nextUpdate = Date.now() + timeBetweenPlayerUpdates;
        alt.emitServer('freecam:Update', newPos);
    }
}
