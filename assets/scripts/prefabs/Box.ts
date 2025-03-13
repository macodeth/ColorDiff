import { _decorator, Color, Component, Node, Sprite, tween, Vec3 } from 'cc';
import { eventManager, UIEvent } from '../managers/eventManager';
const { ccclass, property } = _decorator;

@ccclass('Box')
export class Box extends Component {
    @property (Sprite)
    sprite: Sprite = null;
    setColor (color: Color) {
        this.sprite.color = color;
    }
    animateColor (color: Color) {
        tween(this.sprite)
        .to(0.2, {color: color})
        .start()
    }
    reuse () {
        this.node.scale = Vec3.ZERO;
    }
    onLoad () {
        this.node.on(Node.EventType.TOUCH_END, () => {
            eventManager.ui.notify(UIEvent.CHOOSE_BOX, this.sprite.color, this.node)
        }, this)
    }
}


