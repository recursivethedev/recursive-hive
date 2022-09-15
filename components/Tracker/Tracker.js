/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Pagination from "../Pagination/Pagination";
import { useEffect, useState } from "react";
import styles from "./Tracker.module.scss";

export default function Tracker() {
  const [holdings, setHoldings] = useState([])
  const [highestPage, setHighestPage] = useState(0)

  function fetchHoldings (page = 0, size = 5) {
    fetch(`/api/holdings?page=${page}&size=${size}&sort=-metrics.growthPercentage`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results)
      setHighestPage(data.highestPage)
      setHoldings(data.results)
    })
  }

  useEffect(() => {
    fetchHoldings()
  }, [])

  function pageChanged(pageNum) {
    fetchHoldings(pageNum)
  }
  
  return (
    <>
      <div className={styles.base}>
        <div className={styles.headers}>
          <span>Ticker</span>
          <span>Initial investment (USD)</span>
          <span>Average entry (USD)</span>
          <span>Current value (USD)</span>
          <span>Current price (USD)</span>
          <span>Daily income</span>
          <span>P&L (%)</span>
        </div>

        { holdings.map((holding) => <Bar data={holding} key={holding._id} /> ) }

        <Pagination highestPage={highestPage} pageChanged={pageChanged} />
      </div>
    </>
  );
}

function Bar({ data }) {
  const currency = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: currency
  })

  const icon = 'btc'

  // Prices
  const initialValue = currency.format(data.metrics.initialValue.toFixed(2))
  const currentValue = currency.format(data.currentValue.toFixed(2))
  const averageEntry = currency.format(data.buyRange.avg.toFixed(2))
  const currentPrice = currency.format(data.asset?.currentPrice.toFixed(2) || 0)
  const dailyIncome = currency.format(data.yields?.daily.toFixed(2) || 0)
  const growth = (data.metrics.growthPercentage).toFixed(1)

  const color = growth <= 0 ? 'red' : 'green'

  // Graph colors
  const style = color === "green" ? styles.textGreen : styles.textRed;

  return (
    <div className={styles.container}>
      <div>
        <img src={data.asset?.icon || ''} alt={`${data.asset?.name} icon`} className={styles.tracker__icon} />
        <p>{ data.asset?.symbol }</p>
      </div>
      <div>
        {color === "green" ? (
          <img alt="Caret icon" src="/assets/images/tracker-graph-green.svg" />
        ) : (
          <img alt="Caret icon" src="/assets/images/tracker-graph-red.svg" />
        )}

        <div className={styles.bottom}>
          <span>
            ~ <span>$</span>{ initialValue }
          </span>
          <div className={styles.small}>
            {color === "green" ? (
              <img alt="Caret icon" src="/assets/images/caret-green.svg" />
            ) : (
              <img alt="Caret icon" src="/assets/images/caret-red.svg" />
            )}
            <span className={style}>{growth}%</span>
          </div>
        </div>
      </div>
      <div>
        <span>
          <span className={style}>$</span>{ averageEntry }
        </span>
      </div>
      <div>
        <span>
          <span className={style}>$</span>{ currentValue }
        </span>
      </div>
      <div>
        <span>
          <span className={style}>$</span>{ currentPrice }
        </span>
      </div>
      <div>
        <span>
          <span className={style}>$</span>{ dailyIncome }
        </span>
      </div>
      <div>
        <span>
          <span className={style}>{ growth }%</span>
        </span>
      </div>
    </div>
  );
}
