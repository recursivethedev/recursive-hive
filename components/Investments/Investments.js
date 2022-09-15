/* eslint-disable @next/next/no-img-element */
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import styles from "./Investments.module.scss";
import toolTipStyle from "../../styles/TooltipStyle";

export default function Investments() {
  const [data, setData] = useState([])

  const currency = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency'
  })

  useEffect(() => {
    fetch ('/api/holdings?page=0&size=5&sort=-currentValue')
    .then((res) => res.json())
    .then((data) => {
      const holdings = []
      data.results.forEach((holding) => {
        holdings.push({ 
          ...holding, 
          pv: parseInt(holding.metrics?.initialValue || 0), 
          uv: parseInt(holding.currentValue) 
        })
      })

      setData(holdings)
    })
  }, [])

  return (
    <>
      <div className={styles.base}>
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <div className={styles.label}>
              <span className={styles.label__main}>
                Top 5 treasury investments
              </span>
              <span>&nbsp;</span>
              <span className={styles.label__muted}>(USD value)</span>
            </div>
            { /* <Icon icon="charm:screen-maximise" color="#ffffff" /> */ }
          </div>

          <div className={clsx(styles.graph, "recharts__barChart")}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid stroke="#cee2ff0D" vertical={false} />
                <YAxis
                  axisLine={false}
                  dx={-20}
                  scale="linear"
                  stroke="#72799bb3"
                  tickLine={false}
                  width={75}

                />
                <Bar
                  barSize={6}
                  dataKey="pv"
                  fill="#c0a9ff"
                  radius={[10, 10, 0, 0]}
                />
                <Bar
                  barSize={6}
                  dataKey="uv"
                  fill="#d8ff83"
                  radius={[10, 10, 0, 0]}
                />
                <Tooltip 
                  cursor={false}
                  wrapperStyle={toolTipStyle.wrapper}
                  contentStyle={toolTipStyle.content}
                  labelStyle={toolTipStyle.label}
                  itemStyle={toolTipStyle.item}
                  formatter={(value, name, props) => {
                    if (name === 'pv') {
                      return [currency.format(value), 'Initial Value']
                    } else if (name === 'uv') {
                      return [currency.format(value), 'Current Value']
                    }
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload.length) {
                      return payload[0].payload.asset?.name
                    }
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className={styles.graph_yAxis}>USD Value</p>

            <div className={styles.graph_xAxis}>
              { data.map((holding) => {
                return (
                  <div key={holding._id}>
                    <img 
                      alt={`${holding.asset?.name} icon`} 
                      src={ holding.asset?.icon || ''} 
                      className={styles.tracker__icon}
                    />
                    <span>{holding.asset?.symbol}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
