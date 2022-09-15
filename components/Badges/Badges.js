/* eslint-disable @next/next/no-img-element */
// import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { useState } from "react";
import styles from "./Badges.module.scss";
import Progress from './Progress'
import clsx from "clsx";

const carets = {
  positive: './assets/images/caret-green.svg',
  negative: './assets/images/caret-red.svg'
};

export default function Badges({ population, priceUsd, priceChange }) {
  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];

  const totalProgress = (100 - ((population.count / 40000) * 100)) || 1
  const queenProgress = (100- ((population.queens / 200) * 100)) || 1
  const guardianProgress = (100 - ((population.guardians / 600) * 100)) || 1
  const workerProgress = (100 - ((population.workers / 39200) * 100)) || 1
  const sittingBearsProgress = (100 - ((population.sittingBears / 9500) * 100)) || 1
  const standingBearsProgress = (100 - ((population.standingBears / 500) * 100)) || 1


  return (
    <>
      <div className={styles.base}>
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <p className={styles.leftHeading}>$HNY</p>
            <div className={styles.graph}>
              {/* <ResponsiveContainer width="100%" height="100%">
                <AreaChart width={730} height={250} data={data}>
                  <defs>
                    <linearGradient id="main" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffb444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ffb444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="pv"
                    stroke="#ffb444"
                    fillOpacity={1}
                    fill={`url(#main)`}
                  />
                </AreaChart>
                  </ResponsiveContainer> */}
              <img
                alt="Example graph"
                src="./assets/images/graph-rewards.svg"
              />
            </div>
            <div className={styles.leftNumbers}>
              <p className={styles.leftPrice}>
                ~ <span>$ </span>{priceUsd || '0.00'}
              </p>
              <p className={styles.leftSmallnumbers}>
                <img
                  alt="Caret up"
                  className={styles.leftCaret}
                  src={priceChange < 0 ? carets.negative : carets.positive}
                />
                <span className={clsx(styles.leftPercent, priceChange < 0 ? styles.leftPercentNegative : styles.leftPercentPositive)}>
                  {priceChange || 0}%
                </span>
              </p>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.row}>

              <div className="flex flex-col mx-1">
                <div className={styles.badge}>
                  <div className={styles.badgeWrapper}>
                    <div className={styles.badgeWrapper2}>
                      <span>{ 39200 - population.workers }</span>
                      <span>Remaining</span>
                    </div>
                  </div>
                  <Progress color="#D7FF83" progress={workerProgress} />
                </div>
                <span className="mt-1 text-xxs text-center text-[#D7FF83] font-semibold">Worker bees</span>
              </div>
              
              <div className="flex flex-col mx-1">
                <div className={styles.badge}>
                  <div className={styles.badgeWrapper}>
                    <div className={styles.badgeWrapper2}>
                      <span>{ 600 - population.guardians }</span>
                      <span>Remaining</span>
                    </div>
                  </div>
                  <Progress progress={guardianProgress} />
                </div>
                <span className="mt-1 text-xxs text-center text-[#82b4ff] font-semibold whitespace-nowrap">Guardian bees</span>
              </div>
              
              <div className="flex flex-col mx-1">
                <div className={styles.badge}>
                  <div className={styles.badgeWrapper}>
                    <div className={styles.badgeWrapper2}>
                      <span>{ 180 - population.queens }</span>
                      <span>Remaining</span>
                    </div>
                  </div>
                  <Progress color="#FFE2A9" progress={queenProgress}/>
                </div>
                <span className="mt-1 text-xxs text-center text-[#ffe2a9] font-semibold whitespace-nowrap">Queen bees</span>
              </div>
            </div>

            <div className={clsx(styles.row, '!mx-auto')}>
              <div className="flex flex-col mx-1 mr-6 sm:mr-20 lg:mr-1.5">
                <div className={styles.badge}>
                  <div className={styles.badgeWrapper}>
                    <div className={styles.badgeWrapper2}>
                      <span>{ 9500 - population.sittingBears }</span>
                      <span>Remaining</span>
                    </div>
                  </div>
                  <Progress color="#BFA9FF" progress={sittingBearsProgress}/>
                </div>
                <span className="mt-1 text-xxs text-center text-[#bfa9ff] font-semibold whitespace-nowrap">Sitting bears</span>
              </div>
              
              <div className="flex flex-col mx-1">
                <div className={styles.badge}>
                  <div className={styles.badgeWrapper}>
                    <div className={styles.badgeWrapper2}>
                      <span>{ 500 - population.standingBears }</span>
                      <span>Remaining</span>
                    </div>
                  </div>
                  <Progress color="#A9E5FF" progress={standingBearsProgress}/>
                </div>
                <span className="mt-1 text-xxs text-center text-[#A9E5FF] font-semibold whitespace-nowrap">Standing bears</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
