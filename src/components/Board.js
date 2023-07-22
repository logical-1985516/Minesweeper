import React from "react"
import Tile from "./Tile"

export default function Board(props) {  
    const tileElements = props.board.map(row => row.map(tile => <Tile 
        key={tile.id}
        value={tile.value}
        row={tile.row}
        column={tile.column}
        isRevealed={tile.isRevealed}
        isAutoRevealed={tile.isAutoRevealed}
        revealTile={() => {
            return tile.isFlagged
                ? null
                : tile.isRevealed
                ? props.chord(tile.row, tile.column)
                : tile.value === 0
                ? props.revealZeroesAroundTile(tile.row, tile.column)
                : props.revealTile(tile.id)
        }}
        isFlagged={tile.isFlagged}
        flagTile={() => {
            return tile.isRevealed
                ? null
                : props.flagTile(tile.id)
        }}
    />))

    const styles = {
        gridTemplateRows: `repeat(${props.height}, 1fr)`,
        gridTemplateColumns: `repeat(${props.width}, 1fr)`,
        width: `${24 * props.width + 3.2}px`
    }

    return (
        <main className="app--main">
            <div className="app--board-container" style={styles}>
                {tileElements}
            </div>
        </main>
    )
}