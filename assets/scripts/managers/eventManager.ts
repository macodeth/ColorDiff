export enum UIEvent {
    CHOOSE_BOX,
    SFX_LOADED,
    MUSIC_LOADED,
    STAR_FLY_FINISH
}

/**
 * pubsub event system
 */
export class eventManager {
    private handlers_list = [] as {handler: Function, target: any}[][];
    /**
     * assign only 1 handler for this event
     */
    public only (type: UIEvent, handler: Function, target: any) {
        if (!this.handlers_list[type])
            this.handlers_list[type] = [];
        this.handlers_list[type] = [{handler: handler, target: target}]
    }
    /**
     * this event can have multiple handlers
     */
    public on (type: UIEvent, handler: Function, target: any) {
        if (!this.handlers_list[type])
            this.handlers_list[type] = [];
        this.handlers_list[type].push({handler: handler, target: target});
    }
    public off (type: UIEvent, hd: Function, tg: any) {
        if (!this.handlers_list[type]) return;
        this.handlers_list[type] = this.handlers_list[type].filter(({handler, target}) => {
            return (handler != hd) || (target != tg);
        })
    }
    /**
     * notify event to all handlers
     */
    public notify (type: UIEvent, ...params: any[]) {
        if (!this.handlers_list[type]) return;
        this.handlers_list[type].forEach(({handler, target}) => {
            handler.call(target, ...params);
        })
    }
    private static readonly _ui: eventManager = new eventManager();  
    public static get ui () {
        return this._ui;
    }
}