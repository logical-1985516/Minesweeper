import React from "react"

export default function ChangeBoard(props) {
    const [currentBoard, setCurrentBoard] = React.useState({
        difficulty: "Beginner",
        height: 8,
        width: 8,
        mines: 10
    })

    /**
     * The properties that we are going to change to
     */
    const [boardProperties, setBoardProperties] = React.useState({
        difficulty: "",
        height: "",
        width: "",
        mines: ""
    })

    function handleChange(event) {
        const {name, value} = event.target
        setBoardProperties(oldBoardProperties => {
            return {...oldBoardProperties, [name]: value}
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        if (boardProperties.difficulty === "Beginner") {
            boardProperties.height = 8
            boardProperties.width = 8
            boardProperties.mines = 10
            props.changeBoardProperties(8, 8, 10)
        } else if (boardProperties.difficulty === "Intermediate") {
            boardProperties.height = 16
            boardProperties.width = 16
            boardProperties.mines = 40
            props.changeBoardProperties(16, 16, 40)
        } else if (boardProperties.difficulty === "Expert") {
            boardProperties.height = 16
            boardProperties.width = 30
            boardProperties.mines = 99
            props.changeBoardProperties(16, 30, 99)
        } else if (boardProperties.difficulty === "Custom" &&
            boardProperties.height > 0 && boardProperties.height <= 30 &&
            boardProperties.width > 0 && boardProperties.width <= 30 &&
            boardProperties.mines > 0 &&
            boardProperties.mines < boardProperties.height * boardProperties.width) {
            props.changeBoardProperties(boardProperties.height, 
                boardProperties.width, boardProperties.mines)
        } else {
            console.log("please select valid size")
            return
        }
        setCurrentBoard({
            difficulty: boardProperties.difficulty,
            height: boardProperties.height,
            width: boardProperties.width,
            mines: boardProperties.mines
        })
        setBoardProperties({
            difficulty: "",
            height: "",
            width: "",
            mines: ""
        })
    }

    return (
        <div className="changeBoard--container">
            <div className="changeBoard--current">
                <div className="changeBoard--current-title">Currently selected:</div>
                <div>Difficulty: {currentBoard.difficulty}</div>
                <div>Height: {currentBoard.height}</div>
                <div>Width: {currentBoard.width}</div>
                <div>Mines: {currentBoard.mines}</div>
            </div>
            <form onSubmit={handleSubmit} className="changeBoard--form">
                <input
                    type="radio"
                    id="Beginner"
                    name="difficulty"
                    value="Beginner"
                    checked={boardProperties.difficulty === "Beginner"}
                    onChange={handleChange}
                />
                <label htmlFor="Beginner" className="changeBoard--beginner">Beginner</label>
                <br />
                <input
                    type="radio"
                    id="Intermediate"
                    name="difficulty"
                    value="Intermediate"
                    checked={boardProperties.difficulty === "Intermediate"}
                    onChange={handleChange}
                />
                <label htmlFor="Intermediate" className="changeBoard--intermediate">Intermediate</label>
                <br />
                <input
                    type="radio"
                    id="Expert"
                    name="difficulty"
                    value="Expert"
                    checked={boardProperties.difficulty === "Expert"}
                    onChange={handleChange}
                />
                <label htmlFor="Expert" className="changeBoard--expert">Expert</label>
                <br />
                <input
                    type="radio"
                    id="Custom"
                    name="difficulty"
                    value="Custom"
                    checked={boardProperties.difficulty === "Custom"}
                    onChange={handleChange}
                />
                <label htmlFor="Custom" className="changeBoard--custom">Custom </label>
                <label htmlFor="height">Height</label>
                <input 
                    type="number"
                    id="height"
                    name="height"
                    value={boardProperties.height}
                    onChange={handleChange}
                    className="changeBoard--input"
                />
                <label htmlFor="width">Width</label>
                <input
                    type="number"
                    id="width"
                    name="width"
                    value={boardProperties.width}
                    onChange={handleChange}
                    className="changeBoard--input"
                />
                <label htmlFor="mines">Mines</label>
                <input 
                    type="number"
                    id="mines"
                    name="mines"
                    value={boardProperties.mines}
                    onChange={handleChange}
                    className="changeBoard--input"
                />
                <br />
                <button className="changeBoard--button">Confirm</button>
            </form>
        </div>
    )
}