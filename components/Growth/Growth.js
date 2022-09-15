import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import styles from "./Growth.module.scss";
import toolTipStyle from "../../styles/TooltipStyle";

export default function Growth() {
  const [data, setData] = useState([])

  const currency = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency'
  })

  const getMonthName = (month) => {
    switch (month) {
      case 0: 
        return 'Jan'
      case 1:
        return 'Feb'
      case 2:
        return 'Mar'
      case 3:
        return 'Apr'
      case 4:
        return 'May'
      case 5:
        return 'Jun'
      case 6:
        return 'Jul'
      case 7:
        return 'Aug'
      case 8:
        return 'Sep'
      case 9:
        return 'Oct'
      case 10:
        return 'Nov'
      case 11:
        return 'Dec'
    }
  }

  const fetchSnapshots = () => {
    fetch('/api/treasury')
    .then(res => res.json())
    .then((res) => {
      res.results.forEach((result) => {
        const date = new Date(result.timestamp)
        const month = date.getUTCMonth()
        const day = date.getUTCDate()

        const monthName = getMonthName(month)

        result.name = `${monthName} ${day}`.toUpperCase()
      })

      setData(res.results.reverse())
    })
  }

  useEffect(() => {
    fetchSnapshots()
  }, [])

  return (
    <>
      <div className={styles.base}>
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <div className={styles.titles}>
              <button>Treasury growth</button>
            </div>
            { /* <Icon icon="charm:screen-maximise" color="#ffffff" /> */ }
          </div>

          <div className={styles.graph}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line
                  dataKey="value"
                  name="USD Value"
                  stroke="#a392db"
                  strokeWidth={3}
                  // type="monotone"
                  dot={{
                    strokeWidth: 0,
                    r: 4.5,
                    fill: "#ffffff",
                  }}
                />
                <CartesianGrid stroke="#cee2ff0D" />
                <XAxis
                  axisLine={false}
                  dataKey="name"
                  dy={20}
                  padding={{ left: 20, right: 20 }}
                  stroke="#72799bb3"
                  tickLine={false}
                  height={45}
                />
                <YAxis
                  axisLine={false}
                  domain={["dataMin", "dataMax"]}
                  dx={-20}
                  scale="linear"
                  stroke="#72799bb3"
                  tickLine={false}
                  width={75}
                />
                <Tooltip
                  wrapperStyle={toolTipStyle.wrapper}
                  contentStyle={toolTipStyle.content}
                  labelStyle={toolTipStyle.label}
                  itemStyle={toolTipStyle.item}
                  formatter={(value) => {
                    return currency.format(value)
                  }} 
                />
              </LineChart>
            </ResponsiveContainer>
            <p className={styles.graph_yAxis}>USD Value</p>
          </div>
          {/* <div className={styles.graph__legend}>
            <div></div>
            <span>Treasure line</span>
          </div> */}
        </div>
      </div>
    </>
  );
}
