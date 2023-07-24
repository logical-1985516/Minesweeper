import React from "react"

export default function Tile(props) {
    const styles = {
        backgroundColor: props.isAutoRevealed
            ? (props.isFlagged && props.value !== "*"
                ? "red"
                : props.value === "*"
                ? "#777777"
                : "lightgrey")
            : props.isFlagged
            ? "orange"
            : props.isRevealed 
            ? (props.value === "*" ? "darkred" : "lime") 
            : "white"
    }
    return (
        <div className="tile" style={styles} 
            onClick={props.revealTile}
            onContextMenu={props.flagTile}
        >
            {(props.isRevealed || props.isAutoRevealed || props.causedDefeat) && props.value !== 0 && <span>{props.value}</span>}
        </div>
    )
}