import { _decorator, Color, color, Component, easing, Label, Node, Sprite, tween } from 'cc';
import { CustomPostProcess } from '../shaders/CustomPostProcess';
import { MaterialTween } from '../shaders/MaterialTween';
import { sceneManager, SceneName } from '../managers/sceneManager';
const { ccclass, property } = _decorator;

const TITLE = "GAME OVER"
const DELAY = 0.1;

@ccclass('GameOver')
export class GameOver extends Component {
    @property(Label)
    reason: Label = null;
    @property(MaterialTween)
    reasonMt: MaterialTween = null;
    @property(Label)
    title: Label = null;
    @property(CustomPostProcess)
    cpc: CustomPostProcess = null;
    @property(Sprite)
    bkg: Sprite = null;
    show (reason: string, score: number) {
        let color = this.bkg.color.clone();
        color.a = 160;
        // gradually change full screen to gray scale
        tween(this.cpc)
        .to(0.5, {progress: 1})
        .call(() => {
            // fade in overlay background
            tween(this.bkg)
            .to(0.5, {color: color})
            .call(() => {
                // animate title
                for (let i = 0; i < TITLE.length; i++) {
                    this.scheduleOnce(() => {
                        this.title.string += TITLE[i];
                    }, i * DELAY)
                }
                // animate reason label, wait a bit, then load result scene
                this.scheduleOnce(() => {
                    this.reason.string = reason;
                    this.reasonMt.animate("progress", 1.0, 0, 1, easing.sineOut, () => {
                        this.scheduleOnce(() => {
                            sceneManager.loadScene(SceneName.RESULT, score)
                        }, 1.0)
                    })
                }, TITLE.length * DELAY)
            })
            .start()
        })
        .start()
    }
}


