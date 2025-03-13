import { Color, Node, UITransform } from "cc";

export namespace util {
    export function randomIntRange(from: number, to: number) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }
    export function randomRange (from: number, to: number) {
        var rnd = Math.random();
        return from + (to - from) * rnd;
    }
    /**
     * @returns hue in range [0, 360)
     */
    export function rgb2h(r: number, g: number, b: number) {
        let v = Math.max(r, g, b);
        let c = v - Math.min(r, g, b);
        let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c)); 
        return 60 * (h < 0 ? h + 6 : h)
    }
    export function hsv2rgb(h: number, s: number, v: number, out: Color) 
    {                              
        let f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
        out.r = f(5) * 255;
        out.g = f(3) * 255;
        out.b = f(1) * 255;
    }   
    /**
     * convert node's position to a position relative to destNode
     */
    export function toNodeSpace(node: Node, destNode: Node) {
        let worldPos = node.parent.getComponent(UITransform).convertToWorldSpaceAR(node.position)
        return destNode.getComponent(UITransform).convertToNodeSpaceAR(worldPos)
    }
    /**
     * Fisher–Yates shuffle
     */
    export function randomIndices (n: number) {
        let arr = [] as number[];
        for (let i = 0; i < n; i++)
            arr.push(i);
        let res = [] as number[];
        for (let i = 0; i < n; i++) {
            let randId = randomIntRange(0, arr.length - 1);
            res.push(arr[randId]);
            arr.splice(randId, 1);
        }
        return res;
    }
}