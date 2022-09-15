import {
  useCallback,
  useEffect,
  useReducer,
  createContext,
  useMemo,
} from "react";
import { providers, ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import web3 from "web3";
import Coin from "../../lib/HiveCoin.json";
import HiveNft from "../../lib/HiveNFT.json";
import BabyBearsNft from "../../lib/BabyBearsNFT.json";
import Dai from "../../lib/Dai.json";
import Honey from "../../lib/Honey.json";
import MaintenanceFees from "../../lib/MaintenanceFees.json"

const getProviderOptions = () => ({
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "0de4178f314c497d8b3d24d371a4749b", // required
    },
  },
});

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
  tokenContract: null,
  nftContract: null,
  babyBearsNftContract: null,
  mintEvent: null,
  rewardEvent: null,
  maintenanceFeesContract: null,
  ahnyContract: null,
  signer: null
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
        tokenContract: action.tokenContract,
        nftContract: action.nftContract,
        babyBearsNftContract: action.babyBearsNftContract,
        daiContract: action.daiContract,
        ahnyContract: action.ahnyContract,
        maintenanceFeesContract: action.maintenanceFeesContract,
        signer: action.signer
      };
    case "SET_ADDRESS":
      return {
        ...state,
        address: action.address,
      };
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "RESET_WEB3_PROVIDER":
      return initialState;
    case "MINT_EVENT":
      return {
        ...state,
        mintEvent: action.mintEvent
      }
    case "REWARD_CLAIMED":
      return {
        ...state,
       rewardEvent: action.rewardEvent
      }
    default:
      throw new Error();
  }
}

export const Web3ContextApi = createContext();
let web3Modal;

function Web3Context({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
  const { provider, web3Provider, address, chainId, nftContract, gasGwei,signer } = state;

  const mainnetChainId = web3.utils.toHex(process.env.NEXT_PUBLIC_CHAIN_ID);

  useEffect(() => {
    const providerOptions = getProviderOptions();
    if (typeof window !== "undefined") {
      web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true,
        providerOptions, // required
      });
    }
  }, []);

  const connect = useCallback(async function () {
    const provider = await web3Modal?.connect();

    const web3Provider = new providers.Web3Provider(provider);

    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();

    const network = await web3Provider.getNetwork();

    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const ethersSigner = ethersProvider.getSigner();

    const CoinAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

    const CoinContract = new ethers.Contract(
      CoinAddress,
      Coin.abi,
      ethersSigner
    );

    const nftAddress = process.env.NEXT_PUBLIC_GENESIS_BEES_NFT_ADDRESS;
    const nftContract = new ethers.Contract(nftAddress, HiveNft.abi, ethersSigner);

    const babyBearsNftAddress = process.env.NEXT_PUBLIC_BABY_BEARS_NFT_ADDRESS;
    const babyBearsNftContract = new ethers.Contract(babyBearsNftAddress, BabyBearsNft.abi, ethersSigner);

    //const DaiAddress = "0x7c4Fcdc9263620c57958b309633C5d42b7c3502D";
    const DaiAddress = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063';
    const DaiContract = new ethers.Contract(DaiAddress, Dai.abi, ethersSigner);

    //const aHNYAddress = "0x3fdF71A1fb485AD88d9f76Cb1EdE1cA7E8BA73e4"
    const aHNYAddress = '0xaef330458B7807204E5e7D247304C5C948b8C54F';
    const aHNYContract = new ethers.Contract(
      aHNYAddress,
      Honey.abi,
      ethersSigner
    );

    const MaintenanceFeesAddress = "0x25718Be7714cCd32F622bF29570B17C945028404";
    const MaintenanceFeesContract = new ethers.Contract(MaintenanceFeesAddress, MaintenanceFees.abi, ethersSigner);


    dispatch({
      type: "SET_WEB3_PROVIDER",
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
      tokenContract: CoinContract,
      nftContract,
      babyBearsNftContract,
      daiContract: DaiContract,
      ahnyContract: aHNYContract,
      maintenanceFeesContract: MaintenanceFeesContract,
      signer: ethersSigner
    });
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
    },
    [provider]
  );

  useEffect(() => {
    if (window !== "undefined" && web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        window.location.reload();
        console.log("accountsChanged", accounts);
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        });
      };

      const handleChainChanged = (_hexChainId) => {
        window.location.reload();
      };

      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  // Will ask the user to switch chains if they are connected to the wrong chain
  useEffect(() => {
    if (provider && chainId !== 4) {
      provider?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: mainnetChainId }],
      });
      return;
    }
  }, [chainId, provider, mainnetChainId]);

  // Setup Event Listener For Token Contract
  useEffect(() => {
    if (nftContract) {
      const filter = nftContract.filters.Transfer(null, address)
      
      if (web3Provider) {
        web3Provider.on(filter, (data) => {
          dispatch({
            type: 'MINT_EVENT',
            mintEvent: data
          })

          console.log("transfer data");
          console.log(data);
        })
      }
    }
  }, [nftContract])

  useEffect(() => {

    if(nftContract) {

      const filter = nftContract.filters.RewardClaimed()

      if (web3Provider) {
        web3Provider.on(filter, (event) => {

          if(event) {

            if(event.data) {

              let data = event.data;
              let extractedAddress = "0x" + data.slice(26, 40 + 26);

              if(address) {

                if(extractedAddress == address.toLowerCase()) {

                  dispatch({
                      type: "REWARD_CLAIMED",
                      rewardEvent: event 
                  })
                }

              }
            }

          }

        })
      }
        
    }
  }, [nftContract])

  const value = { contextValue, connect, disconnect };
  return (
    <Web3ContextApi.Provider value={value}>{children}</Web3ContextApi.Provider>
  );
}

export default Web3Context;
