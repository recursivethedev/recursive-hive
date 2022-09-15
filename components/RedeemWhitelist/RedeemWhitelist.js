/* eslint-disable @next/next/no-img-element */
import styles from "./RedeemWhitelist.module.scss";
import { styled } from "@mui/material/styles";
import { Slider } from "@mui/material";
import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import { CSVData } from "../MerkleTree/CVSData";
import { Web3ContextApi } from "../Context/Web3Context";
import web3 from "web3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RedeemWhitelist({}) {
  const [whitelist, setWhitelist] = useState(null);
  const { contextValue } = useContext(Web3ContextApi);
  const {
    state: { ahnyContract, daiContract, address },
  } = contextValue;
  const SLIDER_DEFAULT_VALUE = 30;
  const [sliderValue, setSliderValue] = useState(SLIDER_DEFAULT_VALUE);
  const [allow, setAllow] = useState(false);
  const [daiBalance, setDaiBalance] = useState(null);
  const [aHNYBalance, setaHNYBalance] = useState(null);
  const [disable, setDisable] = useState(false);
  const [run, setRun] = useState(false);

  async function GetMerkleTree() {
    const whitelistedAddress = await CSVData();
    // console.log(whitelistedAddress);
    const leafNodes = whitelistedAddress.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });

    return merkleTree;
  }

  useEffect(() => {
    ahnyContract?.on("BuyHoney", (sender, aHNY, DAIPaid) => {
      const newAhny = aHNY.toString();
      const newDai = DAIPaid.toString();

      if(address == sender) {
        setaHNYBalance(
          aHNYBalance +
            parseInt(web3.utils.fromWei(newAhny.toString(), "ether")).toFixed(0)
        );
        setDaiBalance(
          daiBalance -
            parseInt(web3.utils.fromWei(newDai.toString(), "ether")).toFixed(0)
        );
      }
    });
  }, [aHNYBalance, ahnyContract, daiBalance]);

  function getWhitelistHexProof(address, merkleTree) {
    const hashedAddress = keccak256(address);
    const proof = merkleTree.getHexProof(hashedAddress);
    const merkleTreeRoot = merkleTree.getHexRoot();
    console.log("merkleTreeRoot", merkleTreeRoot);
    return proof;
  }

  useEffect(() => {
    async function callMerkleTree() {
      if (address) {
        let merkleTree = await GetMerkleTree();
        const proof = getWhitelistHexProof(address, merkleTree);
        setWhitelist(proof);
        if (proof.length == 0) {
          setRun(true);
        }
      }
    }
    callMerkleTree();
  }, [address]);

  useEffect(() => {
    if (whitelist && run == true) {
      setDisable(true);
      toast("sorry, you are not on the whitelist", {
        position: "bottom-left",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        const _daiBalance = await daiContract.balanceOf(address);
        const formatDai = web3.utils.fromWei(_daiBalance.toString(), "ether");

        setDaiBalance(parseInt(formatDai).toFixed(0));

        const _ahnybalance = await ahnyContract.aHNYBalance(address);
        const formatAHNY = web3.utils.fromWei(_ahnybalance.toString(), "ether");
        setaHNYBalance(parseInt(formatAHNY));

        let allowMe = await daiContract.allowance(
          address,
          ahnyContract?.address
        );

        if (allowMe._hex != "0x00") setAllow(true);
        if (allowMe._hex == "0x00") setAllow(false);
      }
    };
    fetchData();
  }, [address, ahnyContract, daiContract]);

  const harvest = async (e) => {
    if (!allow) {
      const approve = await daiContract.approve(
        ahnyContract?.address,
        "700000000000000000000000000000"
      );
      toast("processing approval, please wait", {
        position: "bottom-left",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      const wait = await approve.wait();
    }

    e.preventDefault();

    const gas = await ahnyContract.estimateGas.buy(
      web3.utils.toWei(sliderValue.toString(), "ether"),
      whitelist
    );
    const buy = await ahnyContract.buy(
      web3.utils.toWei(sliderValue.toString(), "ether"),
      whitelist
    );
    toast("processing transaction, please wait", {
      position: "bottom-left",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    const wait = await buy.wait();
    toast("transaction confirmed", {
      position: "bottom-left",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
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
              <span>$aHNY</span> Whitelist Sale
            </p>
          </div>

          <div className={styles.center}>
            <img
              alt="Sale Polygon icon"
              className={styles.center__left}
              src="/assets/images/redeem.png"
            />
            <div className={styles.center__center}>
              <HiveSlider
                aria-label="Default"
                value={sliderValue}
                max={50}
                min={10}
                onChange={(e) => setSliderValue(e.target.value)}
                step={10}
              />
              <div className={styles.center__label}>
                <span
                  className={clsx({
                    [styles.center__labelActive]: sliderValue === 10,
                  })}
                >
                  10
                </span>
                <span
                  className={clsx({
                    [styles.center__labelActive]: sliderValue === 20,
                  })}
                >
                  20
                </span>
                <span
                  className={clsx({
                    [styles.center__labelActive]: sliderValue === 30,
                  })}
                >
                  30
                </span>
                <span
                  className={clsx({
                    [styles.center__labelActive]: sliderValue === 40,
                  })}
                >
                  40
                </span>
                <span
                  className={clsx({
                    [styles.center__labelActive]: sliderValue === 50,
                  })}
                >
                  50
                </span>
              </div>
            </div>
            <div className={styles.center__right}>
              <span>aHNY</span>
            </div>
          </div>

          <div className={styles.bottom}>
            {/* <img
              alt="Sale Polygon icon"
              className={styles.bottom__1}
              src="/assets/icon/dai.svg"
            /> */}
            {/* <span className={styles.bottom__2}>{daiBalance}</span> */}
            <div className={styles.flex}>
              <span className={styles.bottom__3}>
                DAI Balance: {daiBalance}
              </span>
              <span className={styles.bottom__4}>1 aHNY = $100</span>
            </div>
            <div className={styles.flex}>
              <span className={styles.bottom__3}>
                aHNY Balance: {aHNYBalance}
              </span>
              <span className={styles.bottom__4}>Max = 50 aHNY </span>
            </div>
          </div>

          <button className={styles.mint} onClick={harvest} disabled={disable}>
            <div className={styles.mint__wrapper}>
              <div className={styles.mint__wrapper2}>
                <span>Harvest</span>
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

// TODO: Update color scheme
const HiveBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.02)";

const HiveSlider = styled(Slider)(() => ({
  color: "#ffb629",
  height: 1.5,
  padding: "4px 0 12px",
  width: "calc(100% - 8px)",
  "& .MuiSlider-thumb": {
    height: 9,
    width: 9,
    backgroundColor: "#ffb629",
    boxShadow: HiveBoxShadow,
    "&:focus, &:hover, &.Mui-active": {
      boxShadow:
        "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow: HiveBoxShadow,
      },
    },
  },
  "& .MuiSlider-track": {
    border: "none",
    opacity: "0",
  },
  "& .MuiSlider-rail": {
    opacity: 1,
    backgroundColor: "transparent",
    backgroundImage: "url(/assets/images/slider.svg)",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "50% 50%",
  },
}));
