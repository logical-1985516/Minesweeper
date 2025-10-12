import React from "react"
import Tile from "./Tile"

export default function Board(props) {
    const tileElements = props.board.map(row => row.map(tile => <Tile 
        key={tile.id}
        value={tile.value}
        row={tile.row}
        column={tile.column}
        isRevealed={tile.isRevealed}
        revealTile={() => {
            return tile.isRevealed
                ? props.chord(tile.row, tile.column)
                : tile.value === 0
                ? props.revealZeroesAroundTile(tile.row, tile.column)
                : props.revealTile(tile.row, tile.column)
        }}
        isFlagged={tile.isFlagged}
        flagTile={() => props.flagTile(tile.row, tile.column)}
        gameStatus={props.gameStatus}
        tileSize={props.tileSize}
        numberSize={props.numberSize}
    />))

    /**
     * Due to probably browser rendering, the border width rendered is rounded down to the 
     * nearest 0.8 px, unless it is less than 0.8 px. The border size specified
     * is props.tileSize / 15, which is then rounded to the nearest 0.8 px. We
     * add 0.0001 to account for floating point, so that whole numbers using
     * the decimal system would not be rounded down using the binary system.
     * Just remember that if we want to round down to the nearest x, use
     * Math.floor(value / x) * x.
     */
    const actualBorderSize = props.tileSize < 12 
        ? 0.8
        : Math.floor(props.tileSize / 15 / 0.8 + 0.0001) * 0.8

    const styles = {
        gridTemplateRows: `repeat(${props.height}, 1fr)`,
        gridTemplateColumns: `repeat(${props.width}, 1fr)`,
        width: `${props.tileSize * props.width + 
            2 * actualBorderSize}px`,
        border: `${props.tileSize / 15}px solid black`
    }

    return (
        <main className="board--container">
            <div className="board--outline" style={styles}>
                {tileElements}
            </div>
        </main>
    )
}