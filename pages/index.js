import { useContext, useEffect, useState } from "react";
import Badges from "../components/Badges/Badges";
import Carousel from "../components/Carousel/Carousel";
import { Web3ContextApi } from "../components/Context/Web3Context";
import Footer from "../components/Footer/Footer";
import Mint from "../components/Mint/Mint";
import Rewards from "../components/Rewards/Rewards";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "../components/Sidebar/Sidebar.module.scss";
import Topbar from "../components/Topbar/Topbar";
import { ToastContainer } from "react-toastify";
import web3 from "web3";

export default function Home() {
  const { contextValue } = useContext(Web3ContextApi);
  const {
    state: { tokenContract, nftContract, babyBearsNftContract, address, mintEvent, rewardEvent },
  } = contextValue;

  const [balance, setBalance] = useState(0);
  const [comHNY, setComHNY] = useState(0);
  const [myBeesNft, setMyBeesNft] = useState([]);
  const [myBearsNft, setMyBearsNft] = useState([]);
  const [allow, setAllow] = useState({ bees: false, bears: false });
  const [population, setPopulation] = useState({ count: 0, workers: 0, guardians: 0, queens: 0, sittingBears: 0, standingBears: 0 });
  const [tokenData, setTokenData] = useState([]);
  const [mintedNfts, setMintedNfts] = useState({ queens: [], guardians: [], workers: [], sittingBears: [], standingBears: [] });

  const fetchData = async () => {
    if (address) {
      const [myNftArray1, myNftArray2, myNftArray3, sittingBearsNftArray, standingBearsNftArray ] = await Promise.all([
        nftContract.getTokensOwnedByWallet(address, 1, 13333),
        nftContract.getTokensOwnedByWallet(address, 13333, 26666),
        nftContract.getTokensOwnedByWallet(address, 26666, 40001),
        babyBearsNftContract.getTokensOwnedByWallet(address, 500, 10000),
        babyBearsNftContract.getTokensOwnedByWallet(address, 1, 500)
      ]);

      const genesisBeesArray = [...myNftArray1, ...myNftArray2, ...myNftArray3];
      setMyBeesNft(genesisBeesArray);
      setMyBearsNft([...sittingBearsNftArray, ...standingBearsNftArray]);

      // set NFTs for rewards table
      const beesNfts = genesisBeesArray.reduce((acc, nft) => {
        const num = parseInt(nft.toString());
        if (num <= 200) {
          acc.queens.push(num);
        }
        if (num >= 201 && num <= 800) {
          acc.guardians.push(num);
        }
        if (num >= 801) {
          acc.workers.push(num);
        }
        return acc;
      }, { queens: [], guardians: [], workers: [] });
      const sittingBears = sittingBearsNftArray?.map(nft => parseInt(nft.toString())) || [];
      const standingBears = standingBearsNftArray?.map(nft => parseInt(nft.toString())) || [];
      setMintedNfts({ ...beesNfts, sittingBears, standingBears });

      const _balance = await tokenContract.balanceOf(address);
      const formatBalance = web3.utils.fromWei(_balance.toString(), "ether");
      setBalance(Number(formatBalance).toFixed(1));
      const _compound = await nftContract.getTokenRewards(genesisBeesArray);
      let compound = 0;
      _compound.map((m) => {
        const num = parseInt(m.toString());
        compound = compound + num;
      });
      const compoundTotal = web3.utils.fromWei(compound.toString(), "ether");
      setComHNY(Number(compoundTotal).toFixed(2));
      const allowHive = await tokenContract.allowance(address, nftContract?.address);
      const allowBabyBears = await tokenContract.allowance(address, babyBearsNftContract?.address);

      // set values 
      setAllow({
        bees: allowHive._hex != "0x00",
        bears: allowBabyBears._hex != "0x00"
      });
    }
  };

  useEffect(() => {
    if (!address) { 
      setMyBeesNft([])
      setMyBearsNft([])
      setComHNY(0)
      return 
    }
    fetchData();
  }, [address]);

  useEffect(() => {
    if(!nftContract && !babyBearsNftContract && !tokenContract && !mintEvent && !rewardEvent) return
    fetchData();
  }, [nftContract, babyBearsNftContract, tokenContract, mintEvent, rewardEvent])

  // Get Bee Population
  useEffect(() => {
    fetch('/api/population')
    .then((res) => res.json())
    .then((data) => setPopulation(data))

    async function fetchTokenData() {
      const hnyAddress = '0x1FA2F83BA2DF61c3d370071d61B17Be01e224f3a';
      const response = await fetch(`https://api.dexscreener.io/latest/dex/tokens/${hnyAddress}`);
      const data = await response?.json()
      const firstPair = data?.pairs[0];
      setTokenData(firstPair);
    }
    fetchTokenData();
  }, [])

  const [isMobileSidebarActivated, setIsMobileSidebarActivated] =
    useState(false);

  function toggleMobileSidebar() {
    setIsMobileSidebarActivated((state) => !state);
  }
  return (
    <div className={styles.page}>
      <div className={styles.page__home}>
        <Topbar AddButton={true} toggleMobileSidebar={toggleMobileSidebar} />
        <section className={styles.center}>
          <div className={styles.center__wrapper}>
            <Sidebar
              isMobileSidebarActivated={isMobileSidebarActivated}
              toggleMobileSidebar={toggleMobileSidebar}
            />
            <main className={styles.main}>
              <div className={styles.main__flex}>
                <Mint balance={balance} comHNY={comHNY} allow={allow} />
                <Rewards
                  myBeesNft={myBeesNft}
                  myBearsNft={myBearsNft}
                  comHNY={comHNY}
                  mintedNfts={mintedNfts}
                  priceUsd={tokenData?.priceUsd}
                />
              </div>
              <div className={[styles.main__flex, styles.bottom__flex].join(' ')}>
                <Carousel myBeesNft={myBeesNft} myBearsNft={myBearsNft} address={address} />
                <Badges population={population} priceUsd={tokenData?.priceUsd} priceChange={tokenData?.priceChange?.h24} />
              </div>
            </main>
          </div>
        </section>
        <Footer />
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
    </div>
  );
}
