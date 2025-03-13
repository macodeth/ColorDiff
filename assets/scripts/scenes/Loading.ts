import { _decorator, Canvas, Component, instantiate, Node, Prefab } from 'cc';
import { SceneName, sceneManager } from '../managers/sceneManager';
import { poolManager } from '../managers/poolManager';
import { soundManager } from '../managers/soundManager';
import { eventManager, UIEvent } from '../managers/eventManager';
import { BaseScene } from './BaseScene';
const { ccclass, property } = _decorator;

const MAX_BOX = 64;
const MAX_BOX_FLY = 20;

@ccclass('Loading')
export class Loading extends BaseScene {
    @property(Prefab)
    pfBox: Prefab = null;
    @property(Prefab)
    pfStar: Prefab = null;
    start() {
        poolManager.init(this.pfBox, MAX_BOX)
        poolManager.init(this.pfStar, MAX_BOX_FLY)
        soundManager.init()
    }
    _sfx_loaded = false;
    sfxLoaded () {
        this._sfx_loaded = true;
    }
    _music_loaded = false;
    musicLoaded () {
        this._music_loaded = true;
    }
    _change_scene = false;
    update () {
        if (this._sfx_loaded && this._music_loaded && !this._change_scene) {
            this._change_scene = true;
            sceneManager.loadScene(SceneName.MAIN)
        }
    }
    onLoad () {
        eventManager.ui.on(UIEvent.SFX_LOADED, this.sfxLoaded, this)
        eventManager.ui.on(UIEvent.MUSIC_LOADED, this.musicLoaded, this)
    }
    onDestroy () {
        eventManager.ui.off(UIEvent.SFX_LOADED, this.sfxLoaded, this)
        eventManager.ui.off(UIEvent.MUSIC_LOADED, this.musicLoaded, this)
    }
}


