import { useContext,Suspense, useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import usdcABI from '../public/wheel/data/USDCabi.json';
import contractABI from '../public/wheel/data/arcadeWheel.json';

import { truncateBalance } from '../components/Wheel/utils/utilities';

import Scene from '../components/Wheel/Scene';
import Notification from '../components/Wheel/notification/Notification';
import MusicPlayer from '../components/Wheel/music_player/MusicPlayer';

import styles from '../styles/Wheel.module.css';

import { Web3ContextApi } from "../components/Context/Web3Context";

export default function Wheel() {

  const { contextValue,connect } = useContext(Web3ContextApi);
  const {
    state: { tokenContract, nftContract, babyBearsNftContract, address, mintEvent, rewardEvent,web3Provider,chainId,provider },
  } = contextValue;

  
  const [sceneLoaded, setSceneLoaded] = useState(false);

  const [signer, setSigner] = useState();
  const [balance, setBalance] = useState();
  const [freeSpinRewards, setFreeSpinRewards] = useState("0");
  const [usdcRewards, setUsdcRewards] = useState("0");
  const [usdcContract, setUsdcContract] = useState();
  const [contract, setContract] = useState();
  const [spin, setSpin] = useState(false);
  const [allowance, setAllowance] = useState();
  const [receivedPrize, setReceivedPrize] = useState(null);
  const [prizeStatus, setPrizeStatus] = useState("update");
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState('initial');

  const uiRef = useRef();
  const claimMenuButtonRef = useRef();
  const claimButtonRef = useRef();
  const claimBalanceRef = useRef();
  const claimChevronRef = useRef();
  const claimWrapperRef = useRef();
  const videoRef = useRef();
  const sourceRef = useRef();
  const soundtrackRef = useRef();
  const audioContext = useRef();



  useEffect(() => {

    if (typeof window.ethereum !== 'undefined' && web3Provider) {
   


      const tempContract = new ethers.Contract("0x2F19d76840A2B4f3Ebce41529CA150A4162BCe40", contractABI, web3Provider);

      web3Provider.once("block", () => {
        tempContract.on("RewardReceived", (reward, ownerAddress) => {
          // console.log(reward, ownerAddress)
          if (address === ownerAddress) {
            const rewardNumber = parseInt(reward.toString());
            if (rewardNumber === 0) {
              sourceRef.current.setAttribute("src", "/wheel/celebration/confetti_50.webm");
              videoRef.current.load();
            }
            else if (rewardNumber === 1) {
              sourceRef.current.setAttribute("src", "/wheel/celebration/confetti_150.webm");
              videoRef.current.load();
            }
            else if (rewardNumber === 6) {
              sourceRef.current.setAttribute("src", "/wheel/celebration/confetti_jackpot.webm");
              videoRef.current.load();
            }
            setReceivedPrize(rewardNumber);
          }
        });
      });

      tempContract.on("RewardClaimed", (reward, ownerAddress) => {
        if (address === ownerAddress) {
          if (reward.toString() === "1") {
            setUsdcRewards("0");
          }
          else {
            setFreeSpinRewards("0");
          }
        }
      });

      (async () => {
        if ((await web3Provider.send("eth_accounts")).length !== 0) {
          setSigner(web3Provider.getSigner());
      
        }
      
      })();

      ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          setSigner();
          setAllowance();
        }
        else {
          //for testing
          // console.log(ethereum)
          setSigner(web3Provider.getSigner());

        }
      });
    }

  }, [web3Provider]);

  useEffect(() => {
    if (typeof signer !== 'undefined') {
      setContract(new ethers.Contract("0x2F19d76840A2B4f3Ebce41529CA150A4162BCe40", contractABI, signer));
      setUsdcContract(new ethers.Contract("0xeb8f08a975Ab53E34D8a0330E0D34de942C95926", usdcABI, signer));
    }
  }, [signer]);

  useEffect(() => {

 

    if (typeof address !== 'undefined' && typeof signer !== 'undefined' && typeof usdcContract !== 'undefined' && typeof contract !== 'undefined') {
      (async () => {
        await usdcContract.balanceOf(address)
        .then((value) => setBalance(truncateBalance(ethers.utils.formatUnits(value, 6))))
        .catch((error) => console.error(error));
      })();

      if (prizeStatus !== "on hold") {
        (async () => {
          await contract.addressToUser(address)
          .then((value) => {
            setFreeSpinRewards(value.freeSpin.toString());
            setUsdcRewards(value.USDC.toString());
          })
          .catch((error) => console.error(error));
        })();

        if (prizeStatus === "50" || prizeStatus === "150" || prizeStatus === "500") {
          videoRef.current.style.opacity = '1';
          videoRef.current.play();
          setTimeout(() => videoRef.current.style.opacity = '0', 2750);
          setPrizeStatus("update");
        }
      }

      (async () => {
        await usdcContract.allowance(address, "0x2F19d76840A2B4f3Ebce41529CA150A4162BCe40")
        .then(async (value) => setAllowance(parseInt(value.toString())))
        .catch((error) => console.error(error))
      })();
    }

  });

  async function handleWallet() {

    if (isPlaying === 'initial') {
      audioContext.current.resume();
      soundtrackRef.current.play();
      setIsPlaying('playing');
    }

    if (typeof window.ethereum === 'undefined') {
      window.alert('Please use a MetaMask compatible browser and make sure you have MetaMask installed and enabled.');
    }
    else {

      if (typeof signer === 'undefined') {
        await web3Provider.send("eth_requestAccounts", [])
        .then(async () => {
          setSigner(web3Provider.getSigner());
      
        })
        .catch((error) => {
          console.error(error.message);
        });
      }

    }
  }

  async function handleSpin() {
    if (parseInt(freeSpinRewards) > 0) {
      await contract.claimFreeSpin()
      .then(() => {
        setSpin(true);
        setPrizeStatus("on hold");
      })
      .catch((error) => console.error(error));
    }
    else if (typeof allowance !== 'undefined') {
      if (allowance > 0) {
        if (parseFloat(balance) >= 5) {
          await contract.spinWheel()
          .then(async (txn) => {
            setSpin(true);
            setPrizeStatus("on hold");
            await txn.wait()
            .then((receipt) => {
              console.log(receipt);
              setMessage("Allow 1-3 minutes for the result to be generated via API3.");
              setBalance(parseFloat(balance));
            })
            .catch((error) => {
              console.error(error);
              setMessage("Transaction failed. Please try again.");
              setReceivedPrize(0);
            })
          })
          .catch((error) => console.error(error));
        }
        else {
          setMessage('You must have at least 5 USDC.');
        }
      }
      else {
        await usdcContract.approve("0x2F19d76840A2B4f3Ebce41529CA150A4162BCe40", ethers.BigNumber.from("10000000000000000000000000000000000000000000"))
        .then(async (txn) => {
          setMessage("Please wait for the approval transaction to succeed, then continue to spin the wheel.");
          await txn.wait()
          .then((receipt) => {
            console.log(receipt);
            setBalance(parseFloat(balance));
          })
          .catch((error) => {
            console.error(error);
            setMessage("Approval failed. Please try again.");
          })
        })
        .catch((error) => console.error(error))
      }
    }
    else {
      handleWallet();
    }
  }

  async function handleClaim(event) {
    event.stopPropagation();
    if (usdcRewards !== "0") {
      await contract.claimUSDC()
      .then((value) => console.log(value))
      .catch((error) => console.error(error))
    }
  }

  function expandClaimMenu() {

    if (isPlaying === 'initial') {
      audioContext.current.resume();
      soundtrackRef.current.play();
      setIsPlaying('playing');
    }

    if (claimMenuButtonRef.current.style.width !== "calc(100% - 46px)") {
      claimMenuButtonRef.current.style.transition = "0.5s ease-in-out";
      claimMenuButtonRef.current.style.width = "calc(100% - 46px)";

      claimButtonRef.current.style.transition = "0.5s 0.5s ease-in-out";
      claimButtonRef.current.style.opacity = 1;

      claimBalanceRef.current.style.transition = "0.5s 0.5s ease-in-out";
      claimBalanceRef.current.style.opacity = 1;

      claimChevronRef.current.style.transition = "0.5s ease-in-out";
      claimChevronRef.current.style.transform = "rotate(180deg)";

      claimWrapperRef.current.style.pointerEvents = "auto";
      claimButtonRef.current.style.pointerEvents = "auto";

      if (usdcRewards === "0") {
        claimChevronRef.current.style.opacity = 0.5;
      }
      else {
        claimChevronRef.current.style.opacity = 1;
      }
    }
    else {
      claimMenuButtonRef.current.style.transition = "0.5s 0.5s ease-in-out";
      if (usdcRewards === "0") {
        claimMenuButtonRef.current.style.width = "40px";
        claimChevronRef.current.style.opacity = 0;
      }
      else {
        claimMenuButtonRef.current.style.width = "65px";
        claimChevronRef.current.style.opacity = 1;
      }

      claimButtonRef.current.style.transition = "0.5s ease-in-out";
      claimButtonRef.current.style.opacity = 0;

      claimBalanceRef.current.style.transition = "0.5s ease-in-out";
      claimBalanceRef.current.style.opacity = 0;

      claimChevronRef.current.style.transition = "0.5s 0.5s ease-in-out";
      claimChevronRef.current.style.transform = "rotate(0)";

      claimWrapperRef.current.style.pointerEvents = "none";
      claimButtonRef.current.style.pointerEvents = "none";
    }
  }

  useEffect(() => {
    if (typeof signer !== "undefined") {
      if (claimButtonRef.current.style.opacity === '1') {
        if (claimMenuButtonRef.current.style.width === '40px') {
          claimChevronRef.current.style.opacity = 0.5;
        }
        else if (claimMenuButtonRef.current.style.width === '65px') {
          claimChevronRef.current.style.opacity = 1;
        }
        claimMenuButtonRef.current.style.width = "calc(100% - 46px)";
      }
    }
  }, [usdcRewards]);

  useEffect(() => {
    if (sceneLoaded) {
      setTimeout(() => uiRef.current.style.opacity = 1, 1000);
    }
  }, [sceneLoaded]);

  return (
    <>
      <video playsInline preload="auto" className={styles.celebrationVideo} ref={videoRef}>
        <source src="" type="video/webm" ref={sourceRef} />
      </video>
      <Notification message={message} setMessage={setMessage} />
      <div className={styles.ui} style={{ pointerEvents: (typeof signer === 'undefined' ? 'auto' : 'none'), opacity: 0 }} ref={uiRef}>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2px' }}>
          {typeof signer === "undefined" ?
            null
            :
            <>
              <button className={styles.claimWrapperBackground} aria-label="open claim menu" ref={claimMenuButtonRef} onClick={expandClaimMenu} style={{ width: (usdcRewards === "0" ? '40px' : '65px') }}>
                <img src="/wheel/usdc.svg" className={styles.claimIconBlur} alt="blurred usdc icon" style={{ opacity: (usdcRewards === "0" ? 0 : 1) }} />
              </button>
              <div className={styles.claimWrapper} ref={claimWrapperRef} onClick={expandClaimMenu}>
                <img src="/wheel/usdc.svg" className={styles.claimIcon} alt="usdc icon" />
                <img src="/wheel/chevron_right.svg" className={styles.claimChevron} alt="chevron right" ref={claimChevronRef} style={{ opacity: (usdcRewards === "0" ? 0 : 1) }} />
                <h3 className={styles.claimBalance} ref={claimBalanceRef}>{usdcRewards} USDC</h3>
                <button className={styles.claimButton} onClick={handleClaim} ref={claimButtonRef} style={{ background: (usdcRewards === "0" ? 'gray' : null) }}>Claim Rewards</button>
              </div>
            </>
          }
          <MusicPlayer soundtrackRef={soundtrackRef} audioContext={audioContext} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        </div>

        <button onClick={connect} className={styles.connectButton}>
          {typeof signer === 'undefined' ?
            'CLICK HERE TO CONNECT WALLET'
            :
            <div className={styles.infoWrapper}>
              <span>{address?.substring(0, 6)}...{address?.substring(address.length - 3, address.length)}</span>
              <div className={styles.divider} />
              <span>{balance} USDC</span>
              <div className={styles.divider} />
              <span>{parseInt(freeSpinRewards) > 0 ? 'Free Spin!' : '$5 to Spin'}</span>
            </div>
          }
        </button>
        <div className={styles.hintWrapper}>
          <h5 className={styles.hint}>CLICK ON THE WHEEL TO SPIN IT!</h5>
        </div>
        <div className={styles.bottomText}>Powered by API3</div>
      </div>

      <Suspense fallback={null}>
        <Canvas dpr={2} gl={{ toneMapping: THREE.NoToneMapping }} camera={{ fov: 35, position: [0, 2, 25] }} style={{ height: '100vh', width: '100vw' }}>
          <Scene handleSpin={handleSpin} spin={spin} setSpin={setSpin} receivedPrize={receivedPrize} setReceivedPrize={setReceivedPrize} setSceneLoaded={setSceneLoaded} setPrizeStatus={setPrizeStatus} isPlaying={isPlaying} setIsPlaying={setIsPlaying} soundtrackRef={soundtrackRef} audioContext={audioContext} />
          <OrbitControls
            minAzimuthAngle={-Math.PI / 17}
            maxAzimuthAngle={Math.PI / 17}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 2}
            minDistance={15}
            maxDistance={35}
            target={[0, 2.5, 0]}
            enablePan={false}
          />
        </Canvas>
      </Suspense>
    </>
  );
}
