import { Node, AudioSource, AudioClip, resources, director, assetManager, AssetManager, input, Input, tween } from 'cc';
import { logUtil } from '../utils/logUtil';
import { eventManager, UIEvent } from './eventManager';

export enum SFXName {
    CLICK = "click",
    CORRECT = "correct",
    WRONG = "wrong",
    DING = "ding"
}

const SFX_PATH = "sfx/"
const BACKGROUND_MUSIC_PATH = "background"

export class soundManager {
    private static _instance = new soundManager();
    private static _init = false;
    private _audioSource: AudioSource;
    private _bundle: AssetManager.Bundle = null;

    public static init () {
        if (this._init) return;
        this._init = true;
        let node = new Node();

        director.getScene().addChild(node);

        director.addPersistRootNode(node);

        this._instance._audioSource = node.addComponent(AudioSource);

        assetManager.loadBundle("audios", (error, bundle) => {
            this._instance._bundle = bundle;
            bundle.loadDir(SFX_PATH, () => {
                eventManager.ui.notify(UIEvent.SFX_LOADED)
            })
            bundle.load(BACKGROUND_MUSIC_PATH, () => {
                eventManager.ui.notify(UIEvent.MUSIC_LOADED)
            })
        })

    }

    public static playSFX(sfx: SFXName, volume = 1.0) {
        this._instance._bundle.load(SFX_PATH + sfx, (err, clip: AudioClip) => {
            if (err) {
                logUtil.error(err)
            }
            else {
                this._instance._audioSource.playOneShot(clip, volume);
            }
        });
    }
    private static _play_music = false;
    public static playMusic() {
        if (this._play_music) return;
        this._play_music = true;
        this._instance._bundle.load(BACKGROUND_MUSIC_PATH, (err, clip: AudioClip) => {
            if (err) {
                logUtil.error(err)
            }
            else {
                this._instance._audioSource.stop();
                this._instance._audioSource.clip = clip;
                this._instance._audioSource.loop = true;
                this._instance._audioSource.volume = 0.0;
                // gradually fade in music
                tween(this._instance._audioSource)
                .to(1.5, {volume: 1.0})
                .start()
                this._instance._audioSource.play();
            }
        });
    }
}