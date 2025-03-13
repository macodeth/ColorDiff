import { _decorator, clamp, color, Color, Component, easing, instantiate, Label, macro, Node, Prefab, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { poolManager } from '../managers/poolManager';
import { Box } from '../prefabs/Box';
import { util } from '../utils/util';
import { eventManager, UIEvent } from '../managers/eventManager';
import { SFXName, soundManager } from '../managers/soundManager';
import { BaseScene } from './BaseScene';
import { GameOver } from './GameOver';
import { sceneManager, SceneName } from '../managers/sceneManager';
import { saveManager } from '../managers/saveManager';
import { Star } from '../prefabs/Star';
const { ccclass, property } = _decorator;

const PANEL_SIZE = 450; // drawing panel which contains all boxes
const BOX_SPACING = 5;   // distance between each box
const PANEL_CENTER = v2(0, -20) // center of drawing panel

const SATURATION_MAX = 1;
const SATURATION_MIN = 0.9;

const VALUE_MAX = 1;
const VALUE_MIN = 0.9;
const VALUE_SHIFT_MAX = 0.3;
const VALUE_SHIFT_MIN = 0.07;
const VALUE_SHIFT_STEP = 0.05;

const ROW_COUNT_MIN = 2;
const ROW_COUNT_MAX = 8;

const SCORE_STEP = 10;

@ccclass('Game')
export class Game extends BaseScene {
    @property(Label)
    lbScore: Label = null;
    @property(Label)
    lbTimeLeft: Label = null;
    @property(Prefab)
    pfBox: Prefab = null;
    @property(Prefab)
    pfStar: Prefab = null;
    @property(GameOver)
    gameOver: GameOver = null;
    @property(Node)
    boxRoot: Node = null;
    _box_lst: Node[] = []
    _color_all = color()   // avoid creating new object -> garbage
    _color_diff = color()
    _value_shift = VALUE_SHIFT_MAX
    _current_row_count = ROW_COUNT_MIN
    _score = 0;
    _game_over = false;
    start () {
        this.generate()
        this.updateTime()
    }
    randomizeColors () {
        let currentHue = util.rgb2h(this._color_all.r, this._color_all.g, this._color_all.b)
        // make sure new hue is different than current hue
        // because repeating the same one is boring
        let newHue = (currentHue + util.randomRange(20, 340)) % 360; 
        let saturation = util.randomRange(SATURATION_MIN, SATURATION_MAX);
        let value = util.randomRange(VALUE_MIN, VALUE_MAX);
        util.hsv2rgb(newHue, saturation, value, this._color_all);
        value -= this._value_shift;  // decrease value slightly to create a unique color
        util.hsv2rgb(newHue, saturation, value, this._color_diff);
    }
    drawBoxes (numRowColumn: number) {
        let totalBox = numRowColumn * numRowColumn;
        let numBox = totalBox - this._box_lst.length;
        for (let i = 0; i < numBox; i++) {
            this._box_lst.push(poolManager.getNode(this.pfBox, this.boxRoot));
        }
        let randomIds = util.randomIndices(this._box_lst.length)

        let boxSize = (PANEL_SIZE - (numRowColumn - 1) * BOX_SPACING) / numRowColumn;
        let k = (boxSize + BOX_SPACING) * (numRowColumn - 1) / 2;
        let topLeftX = PANEL_CENTER.x - k;
        let topLeftY = PANEL_CENTER.y - k;
        let uniqueBoxId = util.randomIntRange(0, totalBox - 1);
        for (let i = 0; i < numRowColumn; i++) {
            for (let j = 0; j < numRowColumn; j++) {
                let color = (i * numRowColumn + j == uniqueBoxId) ? this._color_diff : this._color_all;
                let boxX = topLeftX + i * (boxSize + BOX_SPACING);
                let boxY = topLeftY + j * (boxSize + BOX_SPACING);
                let id = numBox > 0 ? randomIds[i * numRowColumn + j] : i * numRowColumn + j;
                let node = this._box_lst[id];
                if (node.scale.x < 1.0) {
                    tween(node)
                    .to(0.5, {scale: Vec3.ONE})
                    .start()
                    node.setPosition(boxX, boxY);
                    node.getComponent(Box).setColor(color)
                } else {
                    tween(node)
                    .to(0.5, {position: v3(boxX, boxY)})
                    .start()
                    node.getComponent(Box).animateColor(color)
                }
                node.getComponent(UITransform).setContentSize(boxSize, boxSize);
            }
        }
    }
    generate () {
        this.randomizeColors()
        this.drawBoxes(this._current_row_count)
        // update difficulty: reduce value difference and increase number of boxes
        this._value_shift = clamp(this._value_shift - VALUE_SHIFT_STEP, VALUE_SHIFT_MIN, VALUE_SHIFT_MAX);
        this._current_row_count = clamp(this._current_row_count + 1, ROW_COUNT_MIN, ROW_COUNT_MAX);
    }
    updateScore () {
        soundManager.playSFX(SFXName.CORRECT)
        this._score += SCORE_STEP;
    }
    _time_scheduler: Function = null;
    updateTime () {
        this.stopTime()
        let time = 10;
        this.lbTimeLeft.string = time.toString()
        this.schedule(this._time_scheduler = () => {
            time -= 1;
            this.lbTimeLeft.string = time.toString();
            if (time <= 0) {
                this.endGame("Time out ...")
            }
        }, 1, 9);
    }
    stopTime () {
        if (this._time_scheduler)
            this.unschedule(this._time_scheduler)
    }
    endGame (reason: string) {
        this._game_over = true;
        this.stopTime()
        this.reserveBox()
        soundManager.playSFX(SFXName.WRONG)
        this.gameOver.show(reason, this._score)
        saveManager.updateHighScore(this._score)
    }
    clickMenu () {
        if (this._game_over) return;
        soundManager.playSFX(SFXName.CLICK)
        sceneManager.loadScene(SceneName.MAIN)
    }
    reserveBox () {
        for (let i = 0; i < this._box_lst.length; i++) {
            tween(this._box_lst[i])
            .delay(0.5)
            .to(1.0, {scale: Vec3.ZERO}, {easing: easing.sineOut})
            .call(() => {
                poolManager.putNode(this._box_lst[i])
            })
            .start()
        }
    }
    chooseBoxHandler (color: Color, node: Node) {
        if (this._game_over) return;
        if (color.equals(this._color_all)) {
            // wrong color
            this.endGame("Wrong color ...")
        } else {
            // correct color: generate new level
            this.spawnStar(node)
            this.updateScore()
            this.updateTime()
            this.generate()
        }
    }
    spawnStar (node: Node) {
        let star = poolManager.getNode(this.pfStar, this.node);
        star.setPosition(util.toNodeSpace(node, this.node))
        star.getComponent(Star).fly(this._color_diff, this.lbScore.node.getPosition())
    }
    starFlyFinish () {
        let score = parseInt(this.lbScore.string);
        score += SCORE_STEP;
        this.lbScore.string = score.toString();
    }
    onLoad () {
        eventManager.ui.on(UIEvent.CHOOSE_BOX, this.chooseBoxHandler, this);
        eventManager.ui.on(UIEvent.STAR_FLY_FINISH, this.starFlyFinish, this);
    }
    onDestroy () {
        eventManager.ui.off(UIEvent.CHOOSE_BOX, this.chooseBoxHandler, this);
        eventManager.ui.off(UIEvent.STAR_FLY_FINISH, this.starFlyFinish, this);
    }
}


