enum ItemKey {
    HIGH_SCORE = "HighScore"
}

export namespace saveManager {
    export function updateHighScore (score: number) {
        let currentHighScore = getHighScore();
        if (currentHighScore < score)
            localStorage.setItem(ItemKey.HIGH_SCORE, score.toString())
    }
    export function getHighScore () {
        let d = localStorage.getItem(ItemKey.HIGH_SCORE);
        if (d) 
            return parseInt(d)
        return 0;
    }
}