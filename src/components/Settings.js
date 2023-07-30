import React from "react"

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

    function handleChange(event) {
        const {name, checked} = event.target
        setFormData(prevFormData => {
            return {...prevFormData, [name]: checked}
        })
    }

    React.useEffect(() => {
        localStorage.setItem("advancedMetrics", JSON.stringify(formData))
        props.changeShowMetricsData(formData)
    }, [formData])

    return (
        <form>
            <span>Show advanced performance metrics: </span>
            <input 
                id="showRQP"
                name="showRQP"
                type="checkbox"
                checked={formData.showRQP}
                onChange={handleChange}
            />
            <label htmlFor="showRQP">RQP</label>
            <input 
                id="showIOS"
                name="showIOS"
                type="checkbox"
                checked={formData.showIOS}
                onChange={handleChange}
            />
            <label htmlFor="showIOS">IOS</label>
            <input 
                id="showClicksPerSecond"
                name="showClicksPerSecond"
                type="checkbox"
                checked={formData.showClicksPerSecond}
                onChange={handleChange}
            />
            <label htmlFor="showClicksPerSecond">CL/s</label>
            <input 
                id="showUsefulClicksPerSecond"
                name="showUsefulClicksPerSecond"
                type="checkbox"
                checked={formData.showUsefulClicksPerSecond}
                onChange={handleChange}
            />
            <label htmlFor="showUsefulClicksPerSecond">UCL/s</label>
            <input 
                id="showThroughput"
                name="showThroughput"
                type="checkbox"
                checked={formData.showThroughput}
                onChange={handleChange}
            />
            <label htmlFor="showThroughput">Throughput</label>
            <input 
                id="showCorrectness"
                name="showCorrectness"
                type="checkbox"
                checked={formData.showCorrectness}
                onChange={handleChange}
            />
            <label htmlFor="showCorrectness">Correctness</label>
        </form>
    )
}