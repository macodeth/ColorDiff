import { NodePool, Prefab, instantiate, Node } from "cc";
import { logUtil } from "../utils/logUtil";

export class poolManager {
    private dictPool: { [name: string]: NodePool } = {}
    private static _instance: poolManager = new poolManager();
    /**
     * get node from NodePool, if failed, create one
     * @require call init to initialize pool first!
     */
    public static getNode (prefab: Prefab, parent: Node) {
        let name = prefab.data.name;
        let node: Node;
        let pool = this._instance.dictPool[name];
        if (pool.size() > 0) {
            // NodePool hit
            node = pool.get();
        }
        else {
            logUtil.debug('oooo       NodePool miss: ' + name)
            node = instantiate(prefab);
        }
        if (parent)
            parent.addChild(node);
        return node;
    }

    public static putNode (node: Node) {
        if (!node) return;
        let name = node.name;
        let pool = this._instance.dictPool[name];
        if (pool)
            pool.put(node);
        else
            logUtil.debug("oooo       Unable to reserve node " + node.name)
    }

    public static init (prefab: Prefab, reserveCount = 0) {
        let name = prefab.data.name;
        if (this._instance.dictPool.hasOwnProperty(name)) return;
        let pool = new NodePool(name);
        this._instance.dictPool[name] = pool;
        this.reserve(prefab, reserveCount)
    }
    private static reserve (prefab: Prefab, count = 1) {
        logUtil.debug('oooo       Reserve ' + prefab.data.name + ' ' + count)
        for (let i = 0; i < count; i++) {
            let node = instantiate(prefab);
            this.putNode(node);
        }
    }
}
