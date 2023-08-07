import React from "react"

export default function Tile(props) {
    const gameEnded = props.gameStatus === "win" || props.gameStatus === "lose" ||
    props.gameStatus === "viewOldGame"
    /**
     * if game ended and tile is incorrectly flagged, turn it red.
     * if tile is not revealed nor flagged: if game has not yet ended, remain
     * white. Else, become darkgrey (if mine) or lightgrey (if number)
     */
    const styles = {
        backgroundColor: gameEnded && props.isFlagged && props.value !== "*"
            ? "red"
            : props.isFlagged
            ? "orange"
            : props.isRevealed
            ? (props.value === "*" ? "darkred" : "lime")
            : !gameEnded
            ? "white"
            : props.value === "*"
            ? "#777777"
            : "lightgrey",
        height: props.tileSize,
        width: props.tileSize,
        fontSize: `${props.tileSize * 2 / 3}px`,
        border: `${props.tileSize / 15}px solid black`,
        fontSize: `${props.tileSize * props.numberSize}px`
    }

    /**
     * value of tile displays if: it is revealed, or
     * game ended and tile is not a correctly flagged mine (i.e. a number or an
     * incorrectly flagged number). Unrevealed tiles and incorrectly flagged
     * numbers are autorevealed.
     */
    return (
        <div className="tile" 
            style={styles} 
            onClick={props.revealTile}
            onContextMenu={props.flagTile}
        >
            {(props.isRevealed || (gameEnded && !(props.isFlagged && props.value === "*"))) && 
            props.value !== 0 && <span>{props.value}</span>}
        </div>
    )
}