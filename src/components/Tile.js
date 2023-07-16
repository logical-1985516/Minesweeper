import React from "react"

export default function Tile(props) {
    const styles = {
        backgroundColor: props.isFlagged
            ? "orange"
            : props.isRevealed 
            ? (props.value === "*" ? "red" : "lime") 
            : "white"
    }
    return (
        <div className="tile" style={styles} onClick={props.revealTile} onContextMenu={props.flagTile}>
            {props.isRevealed && props.value !== 0 && <span>{props.value}</span>}
        </div>
    )
}