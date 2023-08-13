import React from "react"
import {nanoid} from "nanoid"

export default function Settings(props) {
    const [formData, setFormData] = React.useState(
        JSON.parse(localStorage.getItem("advancedMetrics")) || {
        showRQP: false,
        showIOS: false,
        showClicksPerSecond: false,
        showUsefulClicksPerSecond: false,
        showThroughput: false,
        showCorrectness: false
    })
    const [tileSize, setTileSize] = React.useState(
        JSON.parse(localStorage.getItem("tileSize")) || 24)
    const [openTileSizes, setOpenTileSizes] = React.useState(false)
    const tileSizes = generateTileSizes()
    const [numberSize, setNumberSize] = React.useState(
        JSON.parse(localStorage.getItem("numberSize")) || 2 / 3
    )
    const [openNumberSizes, setOpenNumberSizes] = React.useState(false) 
    const numberSizes = [1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 4 / 5, 9 / 10, 1]

    function handleChange(event) {
        const {name, checked} = event.target
        setFormData(prevFormData => {
            return {...prevFormData, [name]: checked}
        })
    }

    function generateTileSizes() {
        const tileSizesArray = []
        for (let i = 10; i < 42; i = i + 2) {
            tileSizesArray.push(i)
        }
        return tileSizesArray
    }

    function changeTileSize(newTileSize) {
        setTileSize(newTileSize)
        toggleTileSizesDropDown()
    }

    function toggleTileSizesDropDown() {
        setOpenTileSizes(oldOpenTileSizes => !oldOpenTileSizes)
    }

    function changeNumberSize(newNumberSize) {
        setNumberSize(newNumberSize)
        toggleNumberSizesDropDown()
    }

    function toggleNumberSizesDropDown() {
        setOpenNumberSizes(oldOpenNumberSizes => !oldOpenNumberSizes)
    }

    React.useEffect(() => {
        localStorage.setItem("advancedMetrics", JSON.stringify(formData))
        props.changeShowMetricsData(formData)
    }, [formData])

    React.useEffect(() => {
        localStorage.setItem("tileSize", tileSize)
        props.changeTileSize(tileSize)
    }, [tileSize])

    React.useEffect(() => {
        localStorage.setItem("numberSize", numberSize)
        props.changeNumberSize(numberSize)
    }, [numberSize])

    const tileSizesElements = tileSizes.map(size => 
        <div key={nanoid()}
            onClick={() => changeTileSize(size)} 
            style={{backgroundColor: size === tileSize ? "lightblue" : "none"}}
            className="dropdown-item">{size}</div>)

    const numberSizesElements = numberSizes.map(size => 
        <div key={nanoid()}
            onClick={() => changeNumberSize(size)} 
            style={{backgroundColor: Math.abs(size - numberSize) < 0.01 ? "lightblue" : "none"}}
            className="dropdown-item">{Math.round(100 * size)}%</div>)


    return (
        <div>
            <form style={{marginBottom: "10px"}}>
                <span>Show advanced performance metrics: </span>
                <input 
                    id="showRQP"
                    name="showRQP"
                    type="checkbox"
                    checked={formData.showRQP}
                    onChange={handleChange}
                />
                <label htmlFor="showRQP" style={{marginRight: "7px"}}>RQP</label>
                <input 
                    id="showIOS"
                    name="showIOS"
                    type="checkbox"
                    checked={formData.showIOS}
                    onChange={handleChange}
                />
                <label htmlFor="showIOS" style={{marginRight: "7px"}}>IOS</label>
                <input 
                    id="showClicksPerSecond"
                    name="showClicksPerSecond"
                    type="checkbox"
                    checked={formData.showClicksPerSecond}
                    onChange={handleChange}
                />
                <label htmlFor="showClicksPerSecond" style={{marginRight: "7px"}}>CL/s</label>
                <input 
                    id="showUsefulClicksPerSecond"
                    name="showUsefulClicksPerSecond"
                    type="checkbox"
                    checked={formData.showUsefulClicksPerSecond}
                    onChange={handleChange}
                />
                <label htmlFor="showUsefulClicksPerSecond" style={{marginRight: "7px"}}>
                    UCL/s</label>
                <input 
                    id="showThroughput"
                    name="showThroughput"
                    type="checkbox"
                    checked={formData.showThroughput}
                    onChange={handleChange}
                />
                <label htmlFor="showThroughput" style={{marginRight: "7px"}}>Throughput</label>
                <input 
                    id="showCorrectness"
                    name="showCorrectness"
                    type="checkbox"
                    checked={formData.showCorrectness}
                    onChange={handleChange}
                />
                <label htmlFor="showCorrectness">Correctness</label>
            </form>
            <div className="settings--sizes-container">
                <div className="label-and-dropdown">
                    <div>Tile Size: {tileSize}</div>
                    <div>
                        <button onClick={toggleTileSizesDropDown}
                            className="settings--button">Select</button>
                        {openTileSizes && 
                        <div className="dropdown-container">
                        {tileSizesElements}
                        </div>
                        }
                    </div>
                </div>
                <div className="label-and-dropdown">
                    <div>Number Size: {Math.round(100 * numberSize)}%</div>
                    <div>
                        <button onClick={toggleNumberSizesDropDown}
                            className="settings--button">Select</button>
                        {openNumberSizes &&
                        <div className="dropdown-container">
                            {numberSizesElements}
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}