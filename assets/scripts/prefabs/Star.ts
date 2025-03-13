import { _decorator, color, Color, Component, easing, MotionStreak, Node, ParticleSystem2D, Sprite, tween, Vec3 } from 'cc';
import { eventManager, UIEvent } from '../managers/eventManager';
import { poolManager } from '../managers/poolManager';
const { ccclass, property } = _decorator;

@ccclass('Star')
export class Star extends Component {
    @property(Sprite)
    sprite: Sprite = null;
    @property(MotionStreak)
    motionStreak: MotionStreak = null;
    @property(ParticleSystem2D)
    vfx: ParticleSystem2D = null;
    fly (color: Color, destPos: Vec3) {
        this.sprite.color = color;
        this.motionStreak.color = color;
        this.motionStreak.enabled = false;
        this.node.scale = Vec3.ZERO;
        this.sprite.enabled = true;
        tween(this.node)
        .to(1.0, {scale: Vec3.ONE, angle: 360 * 2})
        .call(() => {
            this.node.angle = 0;
            this.motionStreak.enabled = true;
            tween(this.node)
            .to(1.5, {position: destPos}, {easing: easing.backIn})
            .call(() => {
                eventManager.ui.notify(UIEvent.STAR_FLY_FINISH)
                this.vfx.startColor = color;
                this.vfx.resetSystem()
                this.sprite.enabled = false;
                this.motionStreak.enabled = false;
                this.scheduleOnce(() => {
                    poolManager.putNode(this.node)
                }, 1.1)
            })
            .start()
        })
        .start()
    }
}


