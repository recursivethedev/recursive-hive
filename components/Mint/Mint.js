/* eslint-disable @next/next/no-img-element */
import { Icon } from "@iconify/react";
import { styled } from "@mui/material/styles";
import { Slider } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import clsx from "clsx";
import React, { useContext, useState, useEffect } from "react";
import Image from "next/image";
import MintingBee from "../../public/assets/images/minting-bee.png";
import MintingBear from "../../public/assets/images/minting-bear.png";
import { Web3ContextApi } from "../Context/Web3Context";
import { ToastContainer, toast } from "react-toastify";

const NFT_TYPES = { BEES: 'bees', BEARS: 'bears' };
const MINT_OPTIONS = {
  bees: { name: 'Genesis Bee', value: NFT_TYPES.BEES, image: MintingBee, description: '10 HNY', price: 10 },
  bears: { name: 'Baby Bear', value: NFT_TYPES.BEARS, image: MintingBear, description: '2 HNY', price: 2 }
};

import styles from "./Mint.module.scss";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Mint({ balance, comHNY, allow }) {
  const { contextValue } = useContext(Web3ContextApi);
  const {
    state: { tokenContract, nftContract, babyBearsNftContract, mintEvent, rewardEvent },
  } = contextValue;
  const [mintOption, setMintOption] = useState(MINT_OPTIONS.bees.value);

  const SLIDER_DEFAULT_VALUE = 3;
  const [sliderValue, setSliderValue] = useState(SLIDER_DEFAULT_VALUE);
  const [isModalOpen, setModalState] = useState(false);

  const publicMint = async (e) => {
    const { contract, mintLabel, isApproved } = mintOption ===  NFT_TYPES.BEES 
        ? { contract: nftContract, mintLabel: 'bee', isApproved: allow.bees  }
        : { contract: babyBearsNftContract, mintLabel: 'baby bear', isApproved: allow.bears };

    if (!isApproved) {
      const approve = await tokenContract.approve(
        contract?.address,
        "7000000000000000000000000000"
      );
      toast("Harvesting HNY...", {
        position: "bottom-left",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      const wait = await approve.wait();
    }

    e.preventDefault();
    const gas = await contract.estimateGas.publicMint(sliderValue);
    const mint = await contract.publicMint(sliderValue);
    toast("Processing transaction, please bee patient!", {
      position: "bottom-left",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    const wait = await mint.wait();
    toast(
      `Transaction completed - your new ${mintLabel} will appear in a few minutes!`,
      {
        position: "bottom-left",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );
  };

  useEffect(() => {
    if (!mintEvent) return;
    const nftId = parseInt(Number(mintEvent.topics[3]));
    toast(`${mintOption === NFT_TYPES.BEES ? 'Bee' : 'Baby Bear'} #${nftId} has been added to your Hive!`, {
      position: "bottom-left",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }, [mintEvent, mintOption]);

  useEffect(() => {

    if(!rewardEvent) return;
    toast(`Rewards Claimed!`, {
      position: "bottom-left",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  }, [rewardEvent])

  return (
    <>
      <div className={styles.base}>
        <div className={styles.subbase3}></div>
        <div className={styles.subbase2}></div>
        <div className={styles.subbase1}>
          <div className={styles.top}>
            <div className={styles.flex}>
              <p className={styles.heading}>Mint</p>
              <button onClick={() => setModalState(!isModalOpen)}>
                <img src="/assets/images/info-hexagon-icon.svg" alt="Info" />
              </button>
            </div>
            <p className={styles.subheading}>
              <span className={styles.baseText}>Balance</span>&nbsp;
              <span className={styles.yellow}>{balance}</span>&nbsp;HNY
            </p>
          </div>

          <div className="relative">
            <div className="text-xs text-muted font-medium absolute left-0 right-0 top-[24px] text-center">or</div>
            <div role="group" className="flex justify-between -mx-[10px] sm:mx-0" aria-labelledby="radio-group">
              {
                Object.values(MINT_OPTIONS).map(({ name, value, image, description }) => (
                  <label key={`mint_option_${value}`} className={clsx(
                    'relative cursor-pointer flex-1 rounded-radioButton shadow-radioButton p-2 first:mr-6 sm:first:mr-10',
                    mintOption === value ? 'bg-gradient' : 'bg-gradient-light'
                  )}>
                    <input
                      type="radio"
                      name="mintOption"
                      className="hidden peer"
                      checked={mintOption === value}
                      onClick={() => setMintOption(value)}
                      value={value}
                      readOnly
                    />
                    <span className={clsx(
                        'absolute right-[12px] sm:right-[18px] top-[33%] w-[18px] h-[20px] bg-contain block',
                        'bg-buttonIcon peer-checked:bg-buttonIconActive'
                      )}></span>
                    <span className="flex items-center">
                      <span className="flex mr-2 sm:mr-4">
                        <Image src={image} alt={name} width="46" height="45" className="rounded-[17px]" />
                      </span>
                      <span className="flex flex-col">
                        <span className="block text-white text-[14px] font-semibold mb-[3px] mr-5 sm:mr-0">{ name }</span>
                        <span className="text-xs text-muted">{ description }</span>
                      </span>
                    </span>
                  </label>
                ))
              }
            </div>
          </div>

          <div className={styles.slider}>
            <p className={styles.slider__text}>
              Mint <span>{sliderValue}</span> NFTs for{" "}
              <span>{sliderValue * MINT_OPTIONS[mintOption].price} HNY</span>
            </p>
            <HiveSlider
              aria-label="Default"
              value={sliderValue}
              max={5}
              min={1}
              onChange={(e) => setSliderValue(e.target.value)}
              step={1}
            />
            <div className={styles.slider__label}>
              <span
                className={clsx({
                  [styles.slider__labelActive]: sliderValue === 1,
                })}
              >
                1
              </span>
              <span
                className={clsx({
                  [styles.slider__labelActive]: sliderValue === 2,
                })}
              >
                2
              </span>
              <span
                className={clsx({
                  [styles.slider__labelActive]: sliderValue === 3,
                })}
              >
                3
              </span>
              <span
                className={clsx({
                  [styles.slider__labelActive]: sliderValue === 4,
                })}
              >
                4
              </span>
              <span
                className={clsx({
                  [styles.slider__labelActive]: sliderValue === 5,
                })}
              >
                5
              </span>
            </div>
          </div>

          <div className={styles.selection}>
            <p className={styles.selection__label}>Mint up to 5 NFTs at once</p>
            <div className={styles.selection__buttons}>
              {/* <button className={styles.selection__button}>
                <div>
                  <img src="/assets/images/button-hex.svg" alt="hexagon" />
                  <span className={styles.selection__buttonText}>
                    Compound rewards
                  </span>
                </div>
                <span className={styles.selection__buttonNumber}>{comHNY}</span>
              </button> */}
              {/* <button className={styles.selection__button}>
                <div>
                  <img src="/assets/images/button-hex.svg" alt="hexagon" />
                  <span className={styles.selection__buttonText}>
                    Wallet balance
                  </span>
                </div>
                <span className={styles.selection__buttonNumber}>
                  {balance}
                </span>
              </button> */}
            </div>
          </div>

          <button className={styles.mint} onClick={publicMint}>
            <div className={styles.mint__wrapper}>
              <div className={styles.mint__wrapper2}>
                <span>Mint</span>
              </div>
            </div>
          </button>
        </div>

        {isModalOpen && (
          <>
            <div className={styles.modal}>
              {" "}
              <button
                className={styles.modal__close}
                onClick={() => setModalState(false)}
              >
                <Icon color="#72799B" icon="ep:close" height={24} />
              </button>
              <div className={styles.modal__content}>
                <p className={styles.modal__heading}>How does minting work?</p>
                <p className={styles.modal__body}>
                  There are three different tiers of NFTs, all of which can be
                  randomly minted with $HNY tokens. Each tier offers important
                  stylistic differences as well as differences in yield.
                </p>
                <p className={styles.modal__heading}>
                  How much does it cost to mint an NFT?
                </p>
                <p className={styles.modal__body}>
                  Each mint requires 10 $HNY and will randomly mint a NFT from 1
                  of the 3 possible tiers.
                </p>
              </div>
            </div>
            <div className={styles.modal__bg}></div>
          </>
        )}
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
    // backgroundAttachment: "fixed",
    backgroundPosition: "50% 50%",
    backgroundPosition: "center",
    backgroundSize: "100%",
    height: "100%",
    width: "100%",
  },
}));
