import { _decorator, Color, Component, easing, Label, Node, tween } from 'cc';
import { BaseScene } from './BaseScene';
import { MaterialTween } from '../shaders/MaterialTween';
import { saveManager } from '../managers/saveManager';
import { sceneManager, SceneName } from '../managers/sceneManager';
import { logUtil } from '../utils/logUtil';
import { SFXName, soundManager } from '../managers/soundManager';
const { ccclass, property } = _decorator;

@ccclass('Result')
export class Result extends BaseScene {
    _score = 0;
    @property(Label)
    lbScore: Label = null;
    @property(Label)
    lbHighScore: Label = null;
    @property(MaterialTween)
    titleMat: MaterialTween = null;
    @property(MaterialTween)
    highScoreMt: MaterialTween = null;
    @property(Node)
    btns: Node[] = []
    override setData(data: any) {
        this._score = data;
    }
    start () {
        this.titleMat.animate("progress", 1.0, 0.0, 1.0, easing.sineOut, () => {
            this.showScore()
        })
    }
    showScore () {
        this.lbScore.string = "0"
        let step = Math.max(11, Math.floor(this._score / 45));
        let delay = 0.1;
        if (this._score > 0) {
            let currentScore = 0;
            let scoreStep = Math.floor(this._score / step);
            for (let i = 0; i < step - 1; i++) {
                this.scheduleOnce(() => {
                    currentScore += scoreStep;
                    logUtil.log("set score " + currentScore)
                    this.lbScore.string = currentScore.toString()
                    soundManager.playSFX(SFXName.DING)
                }, i * delay)
            }
        }
        this.scheduleOnce(() => {
            this.lbScore.string = this._score.toString()
            this.lbHighScore.string = "High score: " + saveManager.getHighScore().toString()
            this.highScoreMt.animate("progress", 3.0, 0.0, 1.0, easing.sineOut)
        }, delay * step)
        this.showBtns()
    }
    showBtns () {
        for (let i = 0; i < this.btns.length; i++) {
            let pos = this.btns[i].getPosition().clone()
            pos.y += 300;
            tween(this.btns[i])
            .delay(i * 0.5)
            .to(2.0, {position: pos}, {easing: easing.backOut})
            .start()
        }
    }
    clickPlay () {
        soundManager.playSFX(SFXName.CLICK)
        sceneManager.loadScene(SceneName.GAME)
    }
    clickMenu () {
        soundManager.playSFX(SFXName.CLICK)
        sceneManager.loadScene(SceneName.MAIN)
    }
}


