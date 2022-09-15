/* eslint-disable @next/next/no-img-element, react-hooks/exhaustive-deps */
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import web3 from "web3";
import { ethers } from "ethers";
import { Web3ContextApi } from "../Context/Web3Context";
import styles from "./Rewards.module.scss";
const BigNumber = require("bignumber.js");

export default function Rewards({ myBeesNft, myBearsNft, comHNY, mintedNfts, priceUsd }) {
  const { contextValue } = useContext(Web3ContextApi);
  const {
    state: { babyBearsNftContract, maintenanceFeesContract },
  } = contextValue;
  const defaultRewards = {
    workersRewards: 0,
    guardiansRewards: 0,
    queensRewards: 0,
    sittingBearsRewards: 0,
    standingBearsRewards: 0
  };
  const defaultValidNfts = { workers: [], guardians: [], queens: [], sittingBears: [], standingBears: [] };
  const [isModalOpen, setModalState] = useState(false);
  const [nftRewards, setNftRewards] = useState(defaultRewards);
  const [queensRate, setQueensRate] = useState(0);
  const [reload, setReload] = useState(false);
  const [data, setData] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [balance, setBalance] = useState(0);
  const [validNfts, setValidNfts] = useState(defaultValidNfts);

  const getTotalRewards = async ({ contract, nfts }) => {
    if (!nfts || nfts.length === 0) {
      return { rewards: 0, validNfts: [] };
    }

    const maxValue = web3.utils.toWei("150", 'ether');
    const rewards = await contract.getTokenRewards(nfts);

    return await rewards.reduce(async (accPromise, m, index) => {
      const acc = await accPromise;
      const num = parseInt(m.toString());
      const nft = nfts[index];
      if(num < maxValue) {
        acc.rewards = acc.rewards + num;
        acc.validNfts.push(nft);
      } else {
        const maintainFee = await contract?.nextTimePeriodToPayFee(nft);
        if (maintainFee.toString() !== '0') {
          acc.rewards = acc.rewards + num;
          acc.validNfts.push(nft);
        }
      }
      return acc;
    }, Promise.resolve({ rewards: 0, validNfts: [] }));
  };

  // Handle disconnect
  useEffect(() => {
    if (!myBeesNft.length && !myBearsNft.length) {
      setNftRewards(defaultRewards);
      setValidNfts(defaultValidNfts);
    }
  }, [myBeesNft, myBearsNft])

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      if (!maintenanceFeesContract || !babyBearsNftContract) {
        return;
      }

      try {
        const { queens, guardians, workers, sittingBears, standingBears } = mintedNfts;
        const maxValue = web3.utils.toWei("150", 'ether');

        const [
          { rewards: workersRewards, validNfts: validWorkers },
          { rewards: guardiansRewards, validNfts: validGuardians },
          queenRewards,
          { rewards: sittingBearsRewards, validNfts: validSittingBears },
          { rewards: standingBearsRewards, validNfts: validStandingBears } 
        ] = await Promise.all([
          getTotalRewards({ contract: maintenanceFeesContract, nfts: workers }),
          getTotalRewards({ contract: maintenanceFeesContract, nfts: guardians }),
          queens ? maintenanceFeesContract.getTokenRewards(queens) : Promise.resolve(0),
          getTotalRewards({ contract: babyBearsNftContract, nfts: sittingBears }),
          getTotalRewards({ contract: babyBearsNftContract, nfts: standingBears })
        ]);

        let queenTotal = 0;
        let queenRate = new BigNumber(0);
        const validQueens = [];

        for(let i in queenRewards) {

          let m = queenRewards[i];
          const num = parseInt(m.toString());

          if(num < maxValue) {
            queenTotal = queenTotal + num;
            validQueens.push(queens[i]);
          } else {
            const maintainFee = await maintenanceFeesContract?.nextTimePeriodToPayFee(queens[i]);
            if (maintainFee.toString() !== '0') {
              queenTotal = queenTotal + num;
              validQueens.push(queens[i]);
            }
          }
          let rate = await maintenanceFeesContract.getTokensEmissionRate(queens[i]);

          rate = web3.utils.fromWei(rate.toString());

          rate = new BigNumber(rate);

          rate = rate.multipliedBy(86400);

          queenRate = queenRate.plus(rate);

          if (i == queenRewards.length - 1) {
            setQueensRate(queenRate.toFixed(2));
          }
        }

        if (isSubscribed) {
          // set all rewards
          setNftRewards({
            ...defaultRewards,
            workersRewards,
            guardiansRewards,
            queensRewards: queenTotal,
            sittingBearsRewards,
            standingBearsRewards
          });
          setValidNfts({
            ...defaultValidNfts,
            workers: validWorkers,
            guardians: validGuardians,
            queens: validQueens,
            sittingBears: validSittingBears,
            standingBears: validStandingBears
          });
        }
      } catch(error) {
        console.log(error);
      }
      
    };
    fetchData();

    // cancel any future `setNftRewards`
    return () => isSubscribed = false;
  }, [mintedNfts, maintenanceFeesContract, babyBearsNftContract, reload]);

  useEffect(() => {
    setBalance(totalRewards * Number(priceUsd) || 0);
  }, [priceUsd, totalRewards]);

  useEffect(() => {
    const { queens, guardians, workers, sittingBears, standingBears } = validNfts;
    const { workersRewards, guardiansRewards, queensRewards, sittingBearsRewards, standingBearsRewards } = nftRewards;

    setData([
      {
        type: "Workers",
        category: 'bees',
        array: workers,
        quantity: workers.length,
        dailyRewards: 0.05 * workers.length,
        currentRewards: Number(
          web3.utils.fromWei(workersRewards.toString(), "ether")
        ).toFixed(3),
      },
      {
        type: "Guardians",
        category: 'bees',
        array: guardians,
        quantity: guardians.length,
        dailyRewards: 0.1 * guardians.length,
        currentRewards: Number(
          web3.utils.fromWei(guardiansRewards.toString(), "ether")
        ).toFixed(3),
      },
      {
        type: "Queens",
        category: 'bees',
        array: queens,
        quantity: queens.length,
        dailyRewards: queensRate,
        currentRewards: Number(
          web3.utils.fromWei(queensRewards.toString(), "ether")
        ).toFixed(3),
      },
      {
        type: "Sitting Bears",
        category: 'bears',
        array: sittingBears,
        quantity: sittingBears.length,
        dailyRewards: 0.008 * sittingBears.length,
        currentRewards: Number(
          web3.utils.fromWei(sittingBearsRewards.toString(), "ether")
        ).toFixed(3),
      },
      {
        type: "Standing Bears",
        category: 'bears',
        array: standingBears,
        quantity: standingBears.length,
        dailyRewards: 0.05 * standingBears.length,
        currentRewards: Number(
          web3.utils.fromWei(standingBearsRewards.toString(), "ether")
        ).toFixed(3),
      },
    ]);
    const total = BigInt(workersRewards) + BigInt(guardiansRewards) + BigInt(queensRewards) + BigInt(sittingBearsRewards) + BigInt(standingBearsRewards);
    
    setTotalRewards(Number(
      web3.utils.fromWei(total.toString(), "ether")
    ).toFixed(3));
  }, [validNfts, nftRewards]);

  const claim = async ({ array, category }) => {
    const contract = category === 'bees' ? maintenanceFeesContract : babyBearsNftContract;

    try {
      let claimReward = await contract.claimRewards(array, 0);
      toast("Processing transaction...", {
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      const wait = await claimReward.wait();
      setReload(!reload);
      toast("Transaction confirmed!", {
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      const message = error?.data?.message || error?.message;
      toast(message || 'An error occurred, please try again or contact us for assistance.', {
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const claimAll = async ({ nfts, contract }) => {
    if (!nfts || nfts.length === 0) {
      return;
    }

    const hexNfts = nfts.map(item => ethers.BigNumber.from(ethers.utils.hexlify(item)));

    try {
      const claimRewards = await contract.claimRewards(hexNfts, 0);

      toast("processing transaction, please wait", {
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
  
      await claimRewards.wait();
  
      setReload(!reload);
      toast("Transaction confirmed!", {
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      const message = error?.data?.message || error?.message;
      toast(message || 'An error occurred, please try again or contact us for assistance.', {
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <div className={styles.base}>
        <div className={styles.subbase3}></div>
        <div className={styles.subbase2}></div>
        <div className={styles.subbase1}>
          <div className={styles.top}>
            <div className={styles.flex}>
              <p className={styles.heading}>Rewards</p>
              <button onClick={() => setModalState(!isModalOpen)}>
                <img src={"/assets/images/info-hexagon-icon.svg"} alt="Info" />
              </button>
            </div>
            <div className={styles.flex}>
              <p>
                <span className={styles.top__textWhite}>{totalRewards}</span>
                <span className={styles.top__textYellow}> HNY</span>
              </p>
              <p className={styles.top__textMuted}>
                ($
                {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })})
              </p>
            </div>
          </div>

          <div className={styles.table}>
            <div className={clsx(styles.table__row, styles.table__rowheading, 'mr-[30px]')}>
              <span>NFT</span>
              <span>Quantity</span>
              <span>Daily rewards</span>
              <span>Current rewards</span>
              <span></span>
            </div>
            <div className="max-h-[168px] -mr-[10px] pr-[30px] overflow-y-auto scroller">
              {data.map((d, i) => {
                return (
                  <div className={styles.table__row} key={i}>
                    <span>{d.type}</span>
                    <span>{d.quantity}</span>
                    <span>
                      {d.dailyRewards.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {/* HNY ($
                      {(d.dailyRewards * 100).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                      ) */}
                    </span>
                    <span>
                      {d.currentRewards.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {/* HNY ($
                      {(d.currentRewards * 100).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                      ) */}
                    </span>
                    <button
                      onClick={() => claim({ array: d.array, category: d.category })}
                      // disabled={d.currentRewards == 0}
                    >
                      Claim
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-row items-center justify-center">
            <button
              className={styles.claim}
              onClick={() => claimAll({ nfts: [...validNfts.workers, ...validNfts.guardians, ...validNfts.queens], contract: maintenanceFeesContract })}
            >
              Claim all bees
            </button>
            <button
              className={clsx(styles.claim, 'ml-8')}
              onClick={() => claimAll({ nfts: [...validNfts.sittingBears, ...validNfts.standingBears], contract: babyBearsNftContract })}
            >
              Claim all bears
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className={styles.modal}>
            <button
              className={styles.modal__close}
              onClick={() => setModalState(false)}
            >
              <Icon color="#72799B" icon="ep:close" height={24} />
            </button>
            <div className={styles.modal__content}>
              <p className={styles.modal__heading}>
                Do I get taxed when I claim my rewards?
              </p>
              <p className={styles.modal__body}>
              There is currently a 15% claim tax for whenever rewards are claimed.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );

}
