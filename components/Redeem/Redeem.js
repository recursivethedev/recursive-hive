/* eslint-disable @next/next/no-img-element */
import styles from "./Redeem.module.scss";
import React, { useContext, useEffect, useState } from "react";
import { Web3ContextApi } from "../Context/Web3Context";
import web3 from "web3";
import { ToastContainer, toast } from "react-toastify";

export default function Redeem() {
  const { contextValue } = useContext(Web3ContextApi);
  const {
    state: { ahnyContract, tokenContract, address },
  } = contextValue;
  const [tokenBalance, setTokenBalance] = useState(null);
  const [aHNYBalance, setaHNYBalance] = useState(null);

  useEffect(() => {
    ahnyContract?.on("Redeem", (sender, ammount) => {
      const newAhny = ammount.toString();
      // console.log(newAhny);
      if (sender == address) {
        const newAhnyNum = web3.utils.fromWei(newAhny.toString(), "ether");
        setaHNYBalance(0);
        setTokenBalance(parseInt(tokenBalance) + parseInt(newAhnyNum));
      }
    });
  }, [aHNYBalance, address, ahnyContract, tokenBalance]);

  useEffect(() => {
    if (!address || !ahnyContract) return
    const fetchData = async () => {
      if (address) {
        const _daiBalance = await tokenContract.balanceOf(address);
        const formatToken = web3.utils.fromWei(_daiBalance.toString(), "ether");
        setTokenBalance(parseInt(formatToken).toFixed(0));

        const _ahnybalance = await ahnyContract.aHNYBalance(address)
        const formatAHNY = web3.utils.fromWei(_ahnybalance.toString(), "ether");
        setaHNYBalance(formatAHNY);
      }
    };
    fetchData();
  }, [address, ahnyContract, tokenContract]);

  const redeem = async (e) => {
    e.preventDefault();
    const gas = await ahnyContract.estimateGas.redeem(
      web3.utils.toWei(aHNYBalance, "ether")
    );
    const redeemFunc = await ahnyContract.redeem(
      web3.utils.toWei(aHNYBalance, "ether")
    );
    toast("processing transaction, please wait", {
      position: "bottom-left",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    const wait = await redeemFunc.wait();
    toast("transaction confirmed", {
      position: "bottom-left",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  return (
    <>
      <div className={styles.base}>
        <div className={styles.subbase3}></div>
        <div className={styles.subbase2}></div>
        <div className={styles.subbase1}>
          <div className={styles.top}>
            <p>
              Redeem <span>$aHNY</span> to <span>$HNY</span>
            </p>
          </div>

          <div className={styles.center}>
            <div className={styles.row}>
              <div className={styles.row__1}>
                <img src="/assets/images/redeem.png" alt="Hive redeem icon" />
              </div>
              <div className={styles.row__2}>
                <span>{aHNYBalance}</span>
              </div>
              <div className={styles.row__3}>
              </div>
              <div className={styles.row__4}></div>
              <div className={styles.row__5}>
                <span>Balance: {aHNYBalance}</span>
              </div>
              <div className={styles.row__6}>
                <span>aHNY</span>
              </div>
            </div>
            <img
              className={styles.seperator}
              src="/assets/images/redeem-seperator.svg"
              alt="Seperator"
            />
            <div className={styles.row}>
              <div className={styles.row__1}>
                <img src="/assets/images/redeem.png" alt="Hive redeem icon" />
              </div>
              <div className={styles.row__2}>
                <span>{/*50*/}</span>
              </div>
              <div className={styles.row__3}></div>
              <div className={styles.row__4}></div>
              <div className={styles.row__5}>
                <span>Balance: {tokenBalance}</span>
              </div>
              <div className={styles.row__6}>
                <span>HNY</span>
              </div>
            </div>
          </div>

          <button
            className={styles.mint}
            onClick={redeem}
            // disabled={false}
          >
            <div className={styles.mint__wrapper}>
              <div className={styles.mint__wrapper2}>
                <span>Redeem</span>
              </div>
            </div>
          </button>
        </div>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
