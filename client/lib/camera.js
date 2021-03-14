import alt from 'alt';
import native from 'natives';
import cameralist from '../config/cinematic_cameras.js';

class CameraHandler {
    constructor() {
        this.primaryCamera;
        this.secondaryCamera;

        //Cinematic variables
        this.cameralist = cameralist
        this.availableCams = [];
        this.cinematicTimeout;

        this.random_camera;
    };
    
    createPrimaryCam(type, camX, camY, camZ, rotX, rotY, rotZ, fov)   {
        this.primaryCamera = native.createCamWithParams(type, camX, camY, camZ, rotX, rotY, rotZ, fov, true, 2);
    }; 
    createSecondaryCam(type, camX, camY, camZ, rotX, rotY, rotZ, fov)   {
        this.secondaryCamera = native.createCamWithParams(type, camX, camY, camZ, rotX, rotY, rotZ, fov, true, 2);
    }; 
    //create a single camera
    create(type, camX, camY, camZ, rotX, rotY, rotZ, fov)   {
        return native.createCamWithParams(type, camX, camY, camZ, rotX, rotY, rotZ, fov, true, 2);
    }; 
    //destroy a single camera
    destroyCam(camera) {
        try {
            native.destroyCam(camera, true);
            native.setCamActive(camera, false);
            native.renderScriptCams(false, false, 0, false, false);
        } catch (error) {
            if(error) {alt.log("Camera doesn't exist (cameraHandler) -> " + error)}
        }
    };

    renderCam(camera, state) {
        if(state) {
            native.setCamActive(camera, true);
            native.renderScriptCams(true, true, 0, true, true);
        } else {
            native.setCamActive(camera, false);
            native.renderScriptCams(false, false, 0, false, false);
        }
    };

    //Create a cinematic
    cinematic(type, radar = false, loop = true) { 
        native.stopPlayerSwitch()
        let cameraType = this.cameralist[type];
        //push all cameras of a type into the array of cameras
        for (let i = 0; i < cameraType.length; i++) {
            this.availableCams.push(cameraType[i]);
        };
        
        //Random camera to run
        let randomCamera = Math.floor(Math.random() * (this.availableCams.length));
        
        //Creation of the cameras
        this.primaryCamera = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA', 
            this.availableCams[randomCamera].posx_1,
            this.availableCams[randomCamera].posy_1,
            this.availableCams[randomCamera].posz_1,
            this.availableCams[randomCamera].rotx_1,
            this.availableCams[randomCamera].roty_1,
            this.availableCams[randomCamera].rotz_1,
        );
        native.setFocusPosAndVel(this.availableCams[randomCamera].posx_1, this.availableCams[randomCamera].posy_1, this.availableCams[randomCamera].posz_1,0,0,0);

        this.secondaryCamera = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA', 
            this.availableCams[randomCamera].posx_2,
            this.availableCams[randomCamera].posy_2,
            this.availableCams[randomCamera].posz_2,
            this.availableCams[randomCamera].rotx_2,
            this.availableCams[randomCamera].roty_2,
            this.availableCams[randomCamera].rotz_2,
        );
        native.displayRadar(radar);
        native.setHdArea(this.availableCams[randomCamera].posx_1, this.availableCams[randomCamera].posy_1,0, 1000);
        
        //Activation of the cameras
        native.setCamActive(this.primaryCamera, true);
        native.setCamActive(this.secondaryCamera, true); 
        //Cameras fov
        native.setCamFov(this.primaryCamera, this.availableCams[randomCamera].fov_1);
        native.setCamFov(this.secondaryCamera, this.availableCams[randomCamera].fov_2);
        //Cameras interpolation and rendering
        native.renderScriptCams(true, true, 0, true, false);
        native.setCamActiveWithInterp(this.secondaryCamera,this.primaryCamera, this.availableCams[randomCamera].time, 0, 0);   
        
        this.random_camera = this.availableCams[randomCamera];

        //Waits for the time to set on the cinematic camera.
        if(loop) {
            this.cinematicTimeout = alt.setTimeout(() => {
                this.destroyCinematic();
                this.cinematic(type);
                alt.log("Camera destroyed: " + this.primaryCamera)
            }, this.availableCams[randomCamera].time);
        }
    }

    //Destroy cinematic
    destroyCinematic () {
        native.setCamActive(this.primaryCamera, false);
        native.setCamActive(this.secondaryCamera, false);
        native.renderScriptCams(false, false, 0, false, false);
        alt.clearTimeout(this.cinematicTimeout);
        this.destroyCam(this.primaryCamera);
        this.destroyCam(this.secondaryCamera);
        alt.log("Cinematic destroyed !")
    }

    changeCinematicAngle(camx, camy, camz, rotx, roty, angle, timelapse) {
        
        this.destroyCam(this.primaryCamera);
        
        if(this.secondaryCamera === undefined || this.secondaryCamera === null) {
            alt.log("--------------------------------------------------------------------------------------------")
            this.primaryCamera = native.createCamWithParams(
                'DEFAULT_SCRIPTED_CAMERA', 
                camx,
                camy,
                camz,
                rotx,
                roty,
                angle,
            );
        } else {
            alt.log("///////////////////////////////////////////////////////////////////////////////////////////////")
            this.primaryCamera = this.secondaryCamera;
        }
        native.setCamActive(this.primaryCamera, true);
        native.setFocusPosAndVel(camx, camy, camz,0,0,0);
        native.setHdArea(camx, camy, camz, 1000);
        this.secondaryCamera = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA', 
            camx,
            camy,
            camz,
            rotx,
            roty,
            angle,
        );
        native.setCamActive(this.secondaryCamera, true);  
            
        native.setCamFov(this.primaryCamera, 55);
        native.setCamFov(this.secondaryCamera, 55);
        
        native.renderScriptCams(true, true, 0, true, false);
        native.setCamActiveWithInterp(this.secondaryCamera,this.primaryCamera, timelapse * 1000, 0, 0);   

        alt.log(native.isCamActive(this.primaryCamera))  
        alt.log(native.isCamActive(this.secondaryCamera))  
    }

    getRandomCamera() {
        return this.random_camera;
    }
    //Destroy all cams activated
    destroyAllCams() {
        this.destroyCinematic();
        native.destroyAllCams(true);
    };
}

const handler = new CameraHandler();
export default handler;