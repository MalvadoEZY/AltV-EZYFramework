import alt from 'alt'
import native from 'natives'

class PlayerSkin {
    constructor() {

        this.pedAppearance = {
            hairstyle: 1,
            haircolor: 0,
            hairhighlight: 0,

            face_mother: 0,
            face_father: 0,

            skinFirstID_number: 0,
            skinSecondID_number: 0,

            blendShapeMix_number: -1,
            blendSkinMix_number: -1,

            //face details
            Nose_Width: 0,
            Nose_Peak_Hight: 0,
            Nose_Peak_Lenght: 0,
            Nose_Bone_High: 0,
            Nose_Peak_Lowering: 0,
            Nose_Bone_Twist: 0,
            EyeBrown_High: 0,
            EyeBrown_Forward: 0,
            eyebrow: 1,
            eyebrow_opacity: 1.0,
            Cheeks_Bone_High: 0,
            Cheeks_Bone_Width: 0,
            Cheeks_Width: 0,
            Eyes_Openning: 0,
            Lips_Thickness: 0,

            Jaw_Bone_Width: 0,
            Jaw_Bone_Back_Lenght: 0,
            Chimp_Bone_Lowering: 0,
            Chimp_Bone_Lenght: 0,
            Chimp_Bone_Width: 0,
            Chimp_Hole: 0,
            Neck_Thikness: 0,

            beard: -1,
            beard_opacity: 1,
        }
    }

    setCloth(componentID, drawable, texture) {
        const player = alt.Player.local.scriptID;
        native.setPedComponentVariation(player, componentID, drawable, texture, 2)
   
    }

    setProp(componentID, drawable, textureID, attached = true) {
        const player = alt.Player.local.scriptID;
        native.setPedPropIndex(player, componentID, drawable, textureID, attached);
    }

    getClothNumber(player) {
        return new Promise((resolve) => {
            const drawables = {
                //COMPONENTS
                masks: native.getNumberOfPedDrawableVariations(player, 1),
                arms: native.getNumberOfPedDrawableVariations(player, 3),
                legs: native.getNumberOfPedDrawableVariations(player, 4),
                bags: native.getNumberOfPedDrawableVariations(player, 5),
                shoes: native.getNumberOfPedDrawableVariations(player, 6),
                accessories: native.getNumberOfPedDrawableVariations(player, 7),
                undershirt: native.getNumberOfPedDrawableVariations(player, 8),
                armour: native.getNumberOfPedDrawableVariations(player, 9),
                decals: native.getNumberOfPedDrawableVariations(player, 10),
                torso: native.getNumberOfPedDrawableVariations(player, 11),
                //PROPS
                hats: native.getNumberOfPedPropDrawableVariations(player, 0),
                glasses: native.getNumberOfPedPropDrawableVariations(player, 1),
                ears: native.getNumberOfPedPropDrawableVariations(player, 2),
                l_bracelet: native.getNumberOfPedPropDrawableVariations(player, 6),
                r_bracelet: native.getNumberOfPedPropDrawableVariations(player, 7),

            }
            resolve(drawables)
        })
    }
    
    getDrawableTexture(player, componentId, drawableId) {
        const texture = native.getNumberOfPedTextureVariations(player, componentId, drawableId);
        return texture;
    }

    getPropTexture(player, propId, drawableId) {
        const texture = native.getNumberOfPedPropTextureVariations(player, propId, drawableId);
        return texture;
    }

    getCloth(player) {
        //COMPONENTS
        //1 mask
        //2 hair ------
        //3 arms
        //4 legs
        //5 bags
        //6 shoes
        //7 accessories
        //8 undershirt
        //9 armour
        //10 decals
        //11 torso
        //PROPS
        //0 hats
        //1 glasses
        //2 ears
        //6 l_bracelet  watches
        //7 r_bracelet
        const clothes = {
            masks: native.getPedDrawableVariation(player, 1),
            arms: native.getPedDrawableVariation(player, 3),
            legs: native.getPedDrawableVariation(player, 4),
            bags: native.getPedDrawableVariation(player, 5),
            shoes: native.getPedDrawableVariation(player, 6),
            accessories: native.getPedDrawableVariation(player, 7),
            undershirt: native.getPedDrawableVariation(player, 8),
            armour: native.getPedDrawableVariation(player, 9),
            decals: native.getPedDrawableVariation(player, 10),
            torso: native.getPedDrawableVariation(player, 11),  

            //PROPS
            hats: native.getPedPropIndex(player, 0),
            glasses: native.getPedPropIndex(player, 1),
            ears: native.getPedPropIndex(player, 2),
            l_bracelet: native.getPedPropIndex(player, 6),
            r_bracelet: native.getPedPropIndex(player, 7),
        };

        const clothesTextures = {
            masks_tex: native.getPedTextureVariation(player, 1), //Texture
            arms_tex: native.getPedTextureVariation(player, 3), //Texture
            legs_tex: native.getPedTextureVariation(player, 4), //Texture
            bags_tex: native.getPedTextureVariation(player, 5), //Texture
            shoes_tex: native.getPedTextureVariation(player, 6), //Texture
            accessories_tex: native.getPedTextureVariation(player, 7), //Texture
            undershirt_tex: native.getPedTextureVariation(player, 8), //Texture
            armour_tex: native.getPedTextureVariation(player, 9), //Texture
            decals_tex: native.getPedTextureVariation(player, 10), //Texture
            torso_tex: native.getPedTextureVariation(player, 11), //Texture

            hats_tex: native.getPedPropTextureIndex(player, 0), //Texture
            glasses_tex: native.getPedPropTextureIndex(player, 1), //Texture
            ears_tex: native.getPedPropTextureIndex(player, 2), //Texture
            l_bracelet_tex: native.getPedPropTextureIndex(player, 6), //Texture
            r_bracelet_tex: native.getPedPropTextureIndex(player, 7), //Texture
        }

        const mergedObjects = {...clothes, ...clothesTextures}
        return mergedObjects;
    }

    //SET ALL COMPONENT AND FEATURE OF THE PLAYER WHEN JOIN THE SERVER
    setPlayerComponents(appearance, clothes) {
        const player = alt.Player.local.scriptID;
        this.pedAppearance = appearance

        native.setPedHeadBlendData(  //SET PED HEAD BLENDING
            player, 
            appearance.face_mother,
            appearance.face_father,
            null,
            appearance.skinFirstID_number, 
            appearance.skinSecondID_number, //cor escura
            null,
            appearance.blendShapeMix_number,
            appearance.blendSkinMix_number,
            null,
            false,
        );
        native.setPedFaceFeature(player, 0, appearance.Nose_Width)
        native.setPedFaceFeature(player, 1, appearance.Nose_Peak_Hight)
        native.setPedFaceFeature(player, 2, appearance.Nose_Peak_Lenght)
        native.setPedFaceFeature(player, 3, appearance.Nose_Bone_High)
        native.setPedFaceFeature(player, 4, appearance.Nose_Peak_Lowering)
        native.setPedFaceFeature(player, 5, appearance.Nose_Bone_Twist)
        native.setPedFaceFeature(player, 6, appearance.EyeBrown_High)
        native.setPedFaceFeature(player, 7, appearance.EyeBrown_Forward)
        native.setPedFaceFeature(player, 8, appearance.Cheeks_Bone_High)
        native.setPedFaceFeature(player, 9, appearance.Cheeks_Bone_Width)
        native.setPedFaceFeature(player, 10, appearance.Cheeks_Width)
        native.setPedFaceFeature(player, 11, appearance.Eyes_Openning)
        native.setPedFaceFeature(player, 12, appearance.Lips_Thickness)
        native.setPedFaceFeature(player, 13, appearance.Jaw_Bone_Width)
        native.setPedFaceFeature(player, 14, appearance.Jaw_Bone_Back_Lenght)
        native.setPedFaceFeature(player, 15, appearance.Chimp_Bone_Lowering)
        native.setPedFaceFeature(player, 16, appearance.Chimp_Bone_Lenght)
        native.setPedFaceFeature(player, 17, appearance.Chimp_Bone_Width)
        native.setPedFaceFeature(player, 18, appearance.Chimp_Hole)
        native.setPedFaceFeature(player, 19, appearance.Neck_Thikness)
   
        native.setPedComponentVariation(player, 2, appearance.hairstyle, 0, 2); // SET PED HAIRSTYLE
        native.setPedHairColor(player, appearance.haircolor, appearance.hairhighlight); // SETTTING PED HAIRCOLOR  

        native.setPedEyeColor(player, appearance.eyecolor);
        native.setPedHeadOverlayColor(player, 2, 1, appearance.haircolor, appearance.haircolor);
        native.setPedHeadOverlayColor(player, 1, 1, appearance.haircolor, appearance.haircolor);
        native.setPedHeadOverlay(player, 1, appearance.beard, appearance.beard_opacity);
        native.setPedHeadOverlay(player, 2, appearance.eyebrow, appearance.eyebrow_opacity);

        // CLOTHES CLOTHES CLOTHES CLOTHES CLOTHES CLOTHES CLOTHES CLOTHES
        native.setPedComponentVariation(player, 1, clothes.masks, clothes.masks_tex, 2)
        native.setPedComponentVariation(player, 3, clothes.arms, clothes.arms_tex, 2)
        native.setPedComponentVariation(player, 4, clothes.legs, clothes.legs_tex, 2)
        native.setPedComponentVariation(player, 5, clothes.bags, clothes.bags_tex, 2)
        native.setPedComponentVariation(player, 6, clothes.shoes, clothes.shoes_tex, 2)
        native.setPedComponentVariation(player, 7, clothes.accessories, clothes.accessories_tex, 2)
        native.setPedComponentVariation(player, 8, clothes.undershirt, clothes.undershirt_tex, 2)
        native.setPedComponentVariation(player, 9, clothes.armour, clothes.armour_tex, 2)
        native.setPedComponentVariation(player, 10, clothes.decals, clothes.decals_tex, 2)
        native.setPedComponentVariation(player, 11, clothes.torso, clothes.torso_tex, 2)

        //PROPS
        native.setPedPropIndex(player, 0, clothes.hats, clothes.hats_tex, true);
        native.setPedPropIndex(player, 1, clothes.glasses, clothes.glasses_tex, true);
        native.setPedPropIndex(player, 2, clothes.ears, clothes.ears_tex, true);
        native.setPedPropIndex(player, 6, clothes.l_bracelet, clothes.l_bracelet_tex, true);
        native.setPedPropIndex(player, 7, clothes.r_bracelet, clothes.r_bracelet_tex, true);

    }

    getAppearance() {
        return this.pedAppearance;
    }

    resetAppearance() {
      
        this.pedAppearance.hairstyle= 1,
        this.pedAppearance.haircolor= 0,
        this.pedAppearance.hairhighlight= 0,

        this.pedAppearance.face_mother= 0,
        this.pedAppearance.face_father= 0,

        this.pedAppearance.skinFirstID_number= 0,
        this.pedAppearance.skinSecondID_number= 0,

        this.pedAppearance.blendShapeMix_number= -1,
        this.pedAppearance.blendSkinMix_number= -1,

        //face details
        this.pedAppearance.Nose_Width= 0,
        this.pedAppearance.Nose_Peak_Hight= 0,
        this.pedAppearance.Nose_Peak_Lenght= 0,
        this.pedAppearance.Nose_Bone_High= 0,
        this.pedAppearance.Nose_Peak_Lowering= 0,
        this.pedAppearance.Nose_Bone_Twist= 0,
        this.pedAppearance.EyeBrown_High= 0,
        this.pedAppearance.EyeBrown_Forward= 0,
        this.pedAppearance.eyebrow= 1,
        this.pedAppearance.eyebrow_opacity= 1.0,
        this.pedAppearance.Cheeks_Bone_High= 0,
        this.pedAppearance.Cheeks_Bone_Width= 0,
        this.pedAppearance.Cheeks_Width= 0,
        this.pedAppearance.Eyes_Openning= 0,
        this.pedAppearance.Lips_Thickness= 0,

        this.pedAppearance.Jaw_Bone_Width= 0,
        this.pedAppearance.Jaw_Bone_Back_Lenght= 0,
        this.pedAppearance.Chimp_Bone_Lowering= 0,
        this.pedAppearance.Chimp_Bone_Lenght= 0,
        this.pedAppearance.Chimp_Bone_Width= 0,
        this.pedAppearance.Chimp_Hole= 0,
        this.pedAppearance.Neck_Thikness= 0,

        this.pedAppearance.beard= 18,
        this.pedAppearance.beard_opacity= 1
    }

    beginMod(ped) {
        this.setPedChanges(ped);
    }

    setMod(type, mod) {
        const pedID = alt.Player.local.scriptID
        //hair id 24 -> night vision
        switch (type) {
            case 'hairstyle': this.pedAppearance.hairstyle = mod; break;
            case 'haircolor': this.pedAppearance.haircolor = mod; break;
            case 'hairhighlight': this.pedAppearance.hairhighlight = mod; break;
            case 'face_mother': this.pedAppearance.face_mother = mod; break;
            case 'face_father': this.pedAppearance.face_father = mod; break;
            case 'skinFirstID_number': this.pedAppearance.skinFirstID_number = mod; break;
            case 'skinSecondID_number': this.pedAppearance.skinSecondID_number = mod; break;
            case 'blendShapeMix_number': this.pedAppearance.blendShapeMix_number = mod; break;
            case 'blendSkinMix_number': this.pedAppearance.blendSkinMix_number = mod; break;
            case 'eyebrow': this.pedAppearance.eyebrow = mod; break;
            case 'eyebrow_opacity': this.pedAppearance.eyebrow_opacity = mod; break;
            case 'beard': this.pedAppearance.beard = mod; break;
            case 'beard_opacity': this.pedAppearance.beard_opacity = mod; break;
            //face details
            //Ped feature
            case 'Nose_Width': this.pedAppearance.Nose_Width = mod;this.setPedFaceFeature(pedID, 0); break;
            case 'Nose_Peak_Hight': this.pedAppearance.Nose_Peak_Hight = mod;this.setPedFaceFeature(pedID, 1); break;
            case 'Nose_Peak_Lenght': this.pedAppearance.Nose_Peak_Lenght = mod;this.setPedFaceFeature(pedID, 2); break;
            case 'Nose_Bone_High': this.pedAppearance.Nose_Bone_High = mod;this.setPedFaceFeature(pedID, 3); break;
            case 'Nose_Peak_Lowering': this.pedAppearance.Nose_Peak_Lowering = mod;this.setPedFaceFeature(pedID, 4); break;
            case 'Nose_Bone_Twist': this.pedAppearance.Nose_Bone_Twist = mod;this.setPedFaceFeature(pedID, 5); break;
            case 'EyeBrown_High': this.pedAppearance.EyeBrown_High = mod;this.setPedFaceFeature(pedID, 6); break;
            case 'EyeBrown_Forward': this.pedAppearance.EyeBrown_Forward = mod;this.setPedFaceFeature(pedID, 7); break;
            case 'Cheeks_Bone_High': this.pedAppearance.Cheeks_Bone_High = mod;this.setPedFaceFeature(pedID, 8); break;
            case 'Cheeks_Bone_Width': this.pedAppearance.Cheeks_Bone_Width = mod;this.setPedFaceFeature(pedID, 9); break;
            case 'Cheeks_Width': this.pedAppearance.Cheeks_Width = mod;this.setPedFaceFeature(pedID, 10); break;
            case 'Eyes_Openning': this.pedAppearance.Eyes_Openning = mod;this.setPedFaceFeature(pedID, 11); break;
            case 'Lips_Thickness': this.pedAppearance.Lips_Thickness = mod;this.setPedFaceFeature(pedID, 12); break;

            case 'Jaw_Bone_Width': this.pedAppearance.Jaw_Bone_Width = mod;this.setPedFaceFeature(pedID, 13); break;
            case 'Jaw_Bone_Back_Lenght': this.pedAppearance.Jaw_Bone_Back_Lenght = mod;this.setPedFaceFeature(pedID, 14); break;
            case 'Chimp_Bone_Lowering': this.pedAppearance.Chimp_Bone_Lowering = mod;this.setPedFaceFeature(pedID, 15); break;
            case 'Chimp_Bone_Lenght': this.pedAppearance.Chimp_Bone_Lenght = mod;this.setPedFaceFeature(pedID, 16); break;
            case 'Chimp_Bone_Width': this.pedAppearance.Chimp_Bone_Width = mod;this.setPedFaceFeature(pedID, 17); break;
            case 'Chimp_Hole': this.pedAppearance.Chimp_Hole = mod;this.setPedFaceFeature(pedID, 18); break;
            case 'Neck_Thikness': this.pedAppearance.Neck_Thikness = mod;this.setPedFaceFeature(pedID, 19); break;
        }
        this.setPedChanges(pedID);
    }

    setPedChanges(ped) {
        native.setPedComponentVariation(ped, 2, this.pedAppearance.hairstyle, 0, 2); // SET PED HAIRSTYLE
        native.setPedHairColor(ped, this.pedAppearance.haircolor, this.pedAppearance.hairhighlight); // SETTTING PED HAIRCOLOR  
        native.setPedHeadBlendData(  //SET PED HEAD BLENDING
        ped, 
        this.pedAppearance.face_mother,
        this.pedAppearance.face_father,
        null,
        this.pedAppearance.skinFirstID_number, 
        this.pedAppearance.skinSecondID_number, //cor escura
        null,
        this.pedAppearance.blendShapeMix_number,
        this.pedAppearance.blendSkinMix_number,
        null,
        false,
        );

        native.setPedEyeColor(ped, this.pedAppearance.eyecolor);
        native.setPedHeadOverlayColor(ped, 2, 1, this.pedAppearance.haircolor, this.pedAppearance.haircolor);
        native.setPedHeadOverlayColor(ped, 1, 1, this.pedAppearance.haircolor, this.pedAppearance.haircolor);
        native.setPedHeadOverlay(ped, 1, this.pedAppearance.beard, this.pedAppearance.beard_opacity);
        native.setPedHeadOverlay(ped, 2, this.pedAppearance.eyebrow, this.pedAppearance.eyebrow_opacity);

        //electrocuted_1
        //native.setFacialIdleAnimOverride(this.ped, 'electrocuted_1', 0);
    }



    setPedFaceFeature(ped, type) {
        switch (type) {
            case 0: native.setPedFaceFeature(ped, type, this.pedAppearance.Nose_Width); break;
            case 1: native.setPedFaceFeature(ped, type, this.pedAppearance.Nose_Peak_Hight); break;
            case 2: native.setPedFaceFeature(ped, type, this.pedAppearance.Nose_Peak_Lenght); break;
            case 3: native.setPedFaceFeature(ped, type, this.pedAppearance.Nose_Bone_High); break;
            case 4: native.setPedFaceFeature(ped, type, this.pedAppearance.Nose_Peak_Lowering); break;
            case 5: native.setPedFaceFeature(ped, type, this.pedAppearance.Nose_Bone_Twist); break;
            case 6: native.setPedFaceFeature(ped, type, this.pedAppearance.EyeBrown_High); break;
            case 7: native.setPedFaceFeature(ped, type, this.pedAppearance.EyeBrown_Forward); break;
            case 8: native.setPedFaceFeature(ped, type, this.pedAppearance.Cheeks_Bone_High); break;
            case 9: native.setPedFaceFeature(ped, type, this.pedAppearance.Cheeks_Bone_Width); break;
            case 10: native.setPedFaceFeature(ped, type, this.pedAppearance.Cheeks_Width); break;
            case 11: native.setPedFaceFeature(ped, type, this.pedAppearance.Eyes_Openning); break;
            case 12: native.setPedFaceFeature(ped, type, this.pedAppearance.Lips_Thickness); break;
            case 13: native.setPedFaceFeature(ped, type, this.pedAppearance.Jaw_Bone_Width); break;
            case 14: native.setPedFaceFeature(ped, type, this.pedAppearance.Jaw_Bone_Back_Lenght); break;
            case 15: native.setPedFaceFeature(ped, type, this.pedAppearance.Chimp_Bone_Lowering); break;
            case 16: native.setPedFaceFeature(ped, type, this.pedAppearance.Chimp_Bone_Lenght); break;
            case 17: native.setPedFaceFeature(ped, type, this.pedAppearance.Chimp_Bone_Width); break;
            case 18: native.setPedFaceFeature(ped, type, this.pedAppearance.Chimp_Hole);  break;
            case 19: native.setPedFaceFeature(ped, type, this.pedAppearance.Neck_Thikness);  break;
        }      
    }
}

const PlayerSk = new PlayerSkin();
export default PlayerSk;