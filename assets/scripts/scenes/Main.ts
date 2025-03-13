import { _decorator, Color, Component, easing, Label, Node, tween, Vec3 } from 'cc';
import { SceneName, sceneManager } from '../managers/sceneManager';
import { SFXName, soundManager } from '../managers/soundManager';
import { BaseScene } from './BaseScene';
import { MaterialTween } from '../shaders/MaterialTween';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends BaseScene {
    @property(Label)
    title1: Label = null;
    @property(MaterialTween)
    title2Mt: MaterialTween = null;
    @property(Node)
    btn: Node = null;
    onLoad () {
        soundManager.playMusic()
    }
    clickPlay () {
        soundManager.playSFX(SFXName.CLICK)
        sceneManager.loadScene(SceneName.GAME)
    }
    start () {
        tween(this.title1)
        .to(1.0, {color: Color.WHITE})
        .call(() => {
            this.title2Mt.animate("progress", 1.0, 0.0, 1.0, null, () => {
                tween(this.btn)
                .to(1.0, {scale: Vec3.ONE}, {easing: easing.backOut})
                .start()
            })
        })
        .start()
    }
}


