import { director } from "cc"
import { BaseScene } from "../scenes/BaseScene"
import { logUtil } from "../utils/logUtil"

export enum SceneName {
    MAIN = "Main",
    GAME = "Game",
    RESULT = "Result"
}

export namespace sceneManager {
    export function loadScene (sceneName: SceneName, data = null) {
        logUtil.debug("@@@@       loadScene " + sceneName)
        director.loadScene(sceneName, () => {
            // passed data to new scene
            director.getScene().getComponentInChildren(BaseScene).setData(data)
        })
    }
}
