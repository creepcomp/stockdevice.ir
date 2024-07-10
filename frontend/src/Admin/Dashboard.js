import React from "react"
import Chart from "react-google-charts"

const Dashboard = () => {
    const [dailyReport, setDailyReport] = React.useState({})

    React.useEffect(() => {
        fetch("/api/admin/report/daily/").then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                setDailyReport(data)
            }
        })
    }, [])

    const getChartData = () => {
        const data = [["تاریخ", "بازدید"]]
        Object.keys(dailyReport).forEach(x => {
            data.push([new Date(x).toLocaleDateString("fa"), dailyReport[x]])
        })
        return data
    }

    return (
        <div>
            <Chart chartType="LineChart" data={getChartData()} />
        </div>
    )
}

export default Dashboard