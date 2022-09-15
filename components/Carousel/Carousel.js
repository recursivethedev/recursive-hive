/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useContext, useEffect, useRef, useState, Fragment } from "react";
import { Web3ContextApi } from "../Context/Web3Context";
import styles from "./Carousel.module.scss";
import { ethers } from "ethers";
import axios from "axios";
import { toast } from "react-toastify";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import db from "../FireBase/firestore";
import BlackTooltip from "../BlackTooltip/BlackTooltip";
import clsx from "clsx";
import { Transition } from "@headlessui/react";
const CID = require("cids");

const placeholder = [
  {
    image: "/assets/images/queen-placeholder.png",
    name: "Queen Bee #1",
  },
  {
    image: "/assets/images/queen-placeholder.png",
    name: "Queen Bee #2",
  },
  {
    image: "/assets/images/queen-placeholder.png",
    name: "Queen Bee #3",
  },
];

export default function Carousel({ myBeesNft, myBearsNft }) {
  const carouselRef = useRef(null);
  const [currentIndex, setIndex] = useState(0);
  const [data, setData] = useState(placeholder);
  const [initData, setInitData] = useState(placeholder);
  const [isModalOpen, setModalState] = useState(false);
  const [isFilterModalOpen, setFilterModalState] = useState(false);
  const [currentFilterSelection, setFilterSelection] = useState(null);
  const [isImageModalOpen, setImageModalState] = useState(null);
  const [maintainFee, setMaintainFee] = useState(0);
  const [beesPayArr, setBeesPayArr] = useState([]);
  const [bearsPayArr, setBearsPayArr] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [currentName, setName] = useState(data[currentIndex]?.name);
  const [input, setInput] = useState(currentName);
  const [fees, setFees] = useState({ bees: 0, bears: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { contextValue } = useContext(Web3ContextApi);
  const inputRef = useRef(null);
  const categoryToPay = data[currentIndex]?.category;

  const {
    state: {
      address,
      babyBearsNftContract,
      maintenanceFeesContract,
      ahnyContract,
    },
  } = contextValue;

  useEffect(() => {
    const dbData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, `users/${address}/${currentName}`)
        );
        if (querySnapshot._snapshot.docChanges.length == 0) {
          setInput(currentName);
        }
        querySnapshot.forEach((doc) => {
          const newName = doc.data().changeName;
          if (newName) {
            setInput(newName);
          }
        });
      } catch (e) {
        setInput(currentName);
      }
    };
    dbData();
  }, [address, currentName, currentIndex, data]);

  const NFT_CATEGORIES = { BEES: "BEES", BEARS: "BEARS" };

  const IPFS_URLS = {
    BEES: "https://hexagon.mypinata.cloud/ipfs/QmPMkQuhbdxYbDSKGbHXQcM4XKrTkA558yt1GDyWXXWwJ8",
    BEARS:
      "https://hexagon.mypinata.cloud/ipfs/Qmcns3UbqQYNVdt9ReHoL5xPL5LX1WB5GzJwPJ25ezuQUG",
  };

  const getMetadataArray = ({ nfts, category }) =>
    nfts.reduce((acc, nft) => {
      const num = parseInt(nft.toString());
      const nftUrl = `${IPFS_URLS[category]}/${num}`;
      acc.push(nftUrl);
      return acc;
    }, []);

  const getValidPayments = async ({ nfts, contract }) =>
    nfts.reduce(async (accPromise, nft) => {
      const acc = await accPromise;
      const _maintainFee = await contract?.nextTimePeriodToPayFee(nft);
      const payday =
        (_maintainFee - new Date().getTime() / 1000) / 60 / 60 / 24;
      if (_maintainFee?.toString() !== "0" && payday < 60) {
        acc.push(parseInt(nft.toString()));
      }
      return acc;
    }, Promise.resolve([]));

  const renderTotalFees = () => {
    const totalFees =
      fees.bees * beesPayArr.length + fees.bears * bearsPayArr.length;
    return totalFees.toFixed(2);
  };

  useEffect(() => {
    const fetchFees = async () => {
      const [beeFees, bearFees] = await Promise.all([
        maintenanceFeesContract.monthlyTributeFee(),
        babyBearsNftContract.monthlyTributeFee(),
      ]);
      setFees({
        bees: Number(ethers.utils.formatEther(beeFees)),
        bears: Number(ethers.utils.formatEther(bearFees)),
      });
    };
    if (maintenanceFeesContract && babyBearsNftContract) {
      fetchFees();
    }
  }, [maintenanceFeesContract, babyBearsNftContract]);

  useEffect(() => {
    const fetchData = () => {
      const beesMetadataArray = getMetadataArray({
        nfts: myBeesNft,
        category: NFT_CATEGORIES.BEES,
      });
      const bearsMetadataArray = getMetadataArray({
        nfts: myBearsNft,
        category: NFT_CATEGORIES.BEARS,
      });
      setMetadata([...beesMetadataArray, ...bearsMetadataArray]);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myBeesNft, myBearsNft]);

  useEffect(() => {
    const fetchData = async () => {
      const beesValidPay = myBeesNft.length
        ? await getValidPayments({
            nfts: myBeesNft,
            contract: maintenanceFeesContract,
          })
        : [];
      const bearsValidPay = myBearsNft.length
        ? await getValidPayments({
            nfts: myBearsNft,
            contract: babyBearsNftContract,
          })
        : [];

      setBeesPayArr(beesValidPay);
      setBearsPayArr(bearsValidPay);

      if (myBeesNft.length || myBearsNft.length) {
        const nftIndex =
          currentIndex + 1 > myBeesNft.length
            ? currentIndex - myBeesNft.length
            : currentIndex;
        const { nfts, contract } =
          currentIndex + 1 > myBeesNft.length
            ? { nfts: myBearsNft, contract: babyBearsNftContract }
            : { nfts: myBeesNft, contract: maintenanceFeesContract };
        const _maintainFee = await contract?.nextTimePeriodToPayFee(
          nfts[nftIndex]
        );
        setMaintainFee(_maintainFee.toString() !== "0" ? _maintainFee : 0);
      }
    };
    fetchData();
  }, [
    currentIndex,
    myBeesNft,
    myBearsNft,
    babyBearsNftContract,
    maintenanceFeesContract,
  ]);

  useEffect(() => {
    if (metadata.length) {
      let URLs = metadata;

      async function getAllData(URLs) {
        let results = [];

        for (let urlIndex in URLs) {
          const url = URLs[urlIndex];
          let response = await axios.get(url);

          results.push({ ...response?.data, url });
        }

        return results;
      }

      getAllData(URLs)
        .then((response) => {
          let ipfsData = [];

          for (let index in response) {
            let data = response[index];

            if (typeof data == "string") {
              data = JSON.parse(data);
            }

            if (data != undefined) {
              const v0 = data.image?.slice(7);

              const v2 = "https://hexagon.mypinata.cloud/ipfs/" + v0;

              // "?optimizer=image&width=1000";

              const v1 =
                "https://hexagon-ipfs.b-cdn.net/" +
                v0 +
                "?optimizer=image&height=100?quality=50";

              //const v1 = "https://cloudflare-ipfs.com/ipfs/" + v0

              const formatData = {
                name: data.name,
                image: v1,
                image2: v2,
                category: data.url?.includes(
                  "QmPMkQuhbdxYbDSKGbHXQcM4XKrTkA558yt1GDyWXXWwJ8"
                )
                  ? NFT_CATEGORIES.BEES
                  : NFT_CATEGORIES.BEARS,
              };
              ipfsData.push(formatData);
            }
          }
          if (ipfsData.length) {
            setName(ipfsData[0].name);
            setInput(ipfsData[0].name);
          }
          setData(ipfsData);
          setInitData(ipfsData);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  useEffect(() => {
    const carousel = [...carouselRef.current.children];
    for (let i = 0; i < carousel.length; i++) {
      const image = carousel[i];
      if (i === currentIndex) {
        image.setAttribute("data-position", "current");
        image.setAttribute("data-position-meta", -(currentIndex - i));
      } else if (i < currentIndex) {
        image.setAttribute("data-position", "previous");
        image.setAttribute("data-position-meta", -(currentIndex - i));
      } else if (i > currentIndex) {
        image.setAttribute("data-position", "next");
        image.setAttribute("data-position-meta", -(currentIndex - i));
      }
    }
  }, [currentIndex, data]);

  // Handle disconnect
  useEffect(() => {
    if (!myBeesNft.length && !myBearsNft.length) {
      setData(placeholder);
      setName(placeholder[0].name);
      setIndex(0);
    }
  }, [myBeesNft, myBearsNft]);

  function previousIndex() {
    const carousel = [...carouselRef.current.children];
    if (currentIndex !== 0) {
      const newIndex = currentIndex - 1;
      setName(data[newIndex].name);
      setIndex(newIndex);
    }
  }

  function nextIndex() {
    const carousel = [...carouselRef.current.children];
    if (currentIndex < carousel.length - 1) {
      const newIndex = currentIndex + 1;
      setName(data[newIndex].name);
      setIndex(newIndex);
    }
  }
  let dayToPay = 0;
  if (maintainFee)
    dayToPay = (maintainFee - new Date().getTime() / 1000) / 60 / 60 / 24;

  const payFee = async ({ payArr, contract, label, fees }) => {
    if (!payArr?.length) return;

    const eth = (payArr?.length * fees).toFixed(4);
    const network = "polygon"; // use rinkeby testnet
    const NODE_URL =
      "https://polygon-mainnet.infura.io/v3/3ccc468be1d34aebbaaeb7eef9a8c01f";
    const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
    provider.getBalance(address).then((balance) => {
      // convert a currency unit from wei to ether
      const balanceInMatic = ethers.utils.formatEther(balance);

      if (eth > balanceInMatic) {
        toast("Not enough Matic...", {
          position: "bottom-left",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        return;
      }
    });

    let overrides = {
      // To convert Ether to Wei:
      value: ethers.utils.parseEther(eth),
    };

    let monthArray = [];
    for (let i = 0; i < payArr.length; i++) {
      monthArray.push(1);
    }

    const gas = await contract.estimateGas.payMultipleMaintenanceFees(
      payArr,
      monthArray,
      overrides
    );

    try {
      const tx = await contract.payMultipleMaintenanceFees(
        payArr,
        monthArray,
        overrides
      );
      toast(`Processing ${label} transaction...`, {
        position: "bottom-left",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      const result = await tx?.wait();
      toast(`${label} transaction confirmed!`, {
        position: "bottom-left",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(5000);
      window.location.reload();
    } catch (error) {
      const message = error?.data?.message || error?.message;
      toast(
        message ||
          "An error occurred, please try again or contact us for assistance.",
        {
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    }
  };

  const queryWorkerNft = () => {
    // Unselects
    if (currentFilterSelection === "workers") {
      setData(initData);
      return setFilterSelection(initData);
    }

    setFilterSelection("workers");

    const arr = initData.filter((n) => {
      return (
        n.category === NFT_CATEGORIES.BEES &&
        parseInt(n.name.split("#")[1]) >= 800
      );
    });
    setData(arr);
  };

  const queryGuardNft = () => {
    // Unselects
    if (currentFilterSelection === "guardians") {
      setData(initData);
      return setFilterSelection(initData);
    }

    setFilterSelection("guardians");

    const arr = initData.filter((n) => {
      return (
        n.category === NFT_CATEGORIES.BEES &&
        parseInt(n.name.split("#")[1]) >= 201 &&
        parseInt(n.name.split("#")[1]) <= 800
      );
    });
    setData(arr);
  };

  const queryQueenNft = () => {
    // Unselects
    if (currentFilterSelection === "queens") {
      setData(initData);
      return setFilterSelection(initData);
    }

    setFilterSelection("queens");

    const arr = initData.filter((n) => {
      return (
        n.category === NFT_CATEGORIES.BEES &&
        parseInt(n.name.split("#")[1]) <= 200
      );
    });
    setData(arr);
  };

  const querySittingBearNFT = () => {
    // Unselects
    if (currentFilterSelection === "sittingBears") {
      setData(initData);
      return setFilterSelection(initData);
    }

    setFilterSelection("sittingBears");

    const arr = initData.filter((n) => {
      return (
        n.category === NFT_CATEGORIES.BEARS &&
        parseInt(n.name.split("#")[1]) > 500
      );
    });
    setData(arr);
  };

  const queryStandingBearNFT = () => {
    // Unselects
    if (currentFilterSelection === "standingBears") {
      setData(initData);
      return setFilterSelection(initData);
    }

    setFilterSelection("standingBears");

    const arr = initData.filter((n) => {
      return (
        n.category === NFT_CATEGORIES.BEARS &&
        parseInt(n.name.split("#")[1]) < 501
      );
    });
    setData(arr);
  };

  const NFT_FILTERS = [
    { name: "Workers", value: "workers", onQuery: queryWorkerNft },
    { name: "Guardians", value: "guardians", onQuery: queryGuardNft },
    { name: "Queens", value: "queens", onQuery: queryQueenNft },
    {
      name: "Sitting Bear",
      value: "sittingBears",
      onQuery: querySittingBearNFT,
    },
    {
      name: "Standing Bear",
      value: "standingBears",
      onQuery: queryStandingBearNFT,
    },
  ];

  const CAROUSEL_FILTERS = {
    Worker: "BEES",
    Guardian: "BEES",
    Queen: "BEES",
    "Sitting Bear": "BEARS",
    "Standing Bear": "BEARS",
    "Baby Bear": "BEARS",
  };

  function handleFilterModal() {
    setFilterModalState(!isFilterModalOpen);
  }

  function handleImageModal(image) {
    setImageModalState(image);
  }

  function setActive(index, currentIndex) {
    if (index == currentIndex) {
      setIsHovering(true);
      console.log(index, currentIndex);
    }
  }

  function setNotActive(index, currentIndex) {
    if (index == currentIndex) {
      setIsHovering(false);
      console.log(index, currentIndex);
    }
  }

  async function payIndividualFee(currentName) {
    const tokenId = parseInt(currentName.split("#")[1]);
    const before = currentName.substring(0, currentName.indexOf("#") - 1);
    const payArrIndividual = [tokenId];
    console.log(payArrIndividual);
    if (categoryToPay === NFT_CATEGORIES.BEES) {
      await payFee({
        payArr: payArrIndividual,
        contract: maintenanceFeesContract,
        label: "Genesis Bees",
        fees: [3],
      });
    } else {
      await payFee({
        payArr: payArrIndividual,
        contract: babyBearsNftContract,
        label: "Baby Bears",
        fees: [1],
      });
    }
  }
  return (
    <>
      <div className={styles.base}>
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <div className={styles.topLeft}>
              <span>Your NFTs</span>
              <button onClick={() => setModalState(!isModalOpen)}>
                <img
                  src={"/assets/images/info-hexagon-icon.svg"}
                  alt="Info"
                  style={{ position: "relative", left: "-10px" }}
                />
              </button>
            </div>

            <div className={styles.topRight}>
              <p>
                Total fees{" "}
                <span style={{ color: "#ffffff" }}>
                  {renderTotalFees()} MATIC
                </span>{" "}
                due in{" "}
                <span
                  style={
                    dayToPay > 7
                      ? { color: "#86ffbe" }
                      : (dayToPay < 7) & (dayToPay > 3)
                      ? { color: "orange" }
                      : { color: "#e62e2e" }
                  }
                >
                  {dayToPay?.toFixed(0) || 0} days
                </span>
              </p>
              <BlackTooltip
                title={
                  categoryToPay === NFT_CATEGORIES.BEES
                    ? "Pay All HGC"
                    : "Pay All BB"
                }
              >
                <button
                  onClick={async () => {
                    if (categoryToPay === NFT_CATEGORIES.BEES) {
                      await payFee({
                        payArr: beesPayArr,
                        contract: maintenanceFeesContract,
                        label: "Genesis Bees",
                        fees: fees.bees,
                      });
                    } else {
                      await payFee({
                        payArr: bearsPayArr,
                        contract: babyBearsNftContract,
                        label: "Baby Bears",
                        fees: fees.bears,
                      });
                    }
                  }}
                >
                  Pay All{" "}
                  <span className="md:hidden">
                    {categoryToPay === NFT_CATEGORIES.BEES ? "HGC" : "BB"}
                  </span>
                </button>
              </BlackTooltip>
              <button onClick={handleFilterModal}>
                {isFilterModalOpen ? (
                  <img src="/assets/images/filter-button-up-icon.svg" />
                ) : (
                  <img src="/assets/images/filter-button-default-icon.svg" />
                )}
              </button>
            </div>
          </div>

          <div className={styles.carousel__container}>
            <div className={styles.carousel__wrapper}>
              <button onClick={previousIndex}>
                <Icon color="#ffffff" icon="akar-icons:chevron-left" />
              </button>
              <div className={styles.carousel} ref={carouselRef}>
                {data.map((datum, index) => {
                  // console.log(datum.image, ":", index + 1);
                  return (
                    <div
                      className={styles.carousel__img}
                      key={`${datum.name}_${index}`}
                      onMouseEnter={() => setActive(index, currentIndex)}
                      onMouseLeave={() => setNotActive(index, currentIndex)}
                    >
                      <ImageFallback
                        imgClass={"w-[100%] h-auto"}
                        alt={datum.name}
                        src={datum?.image}
                        layout="fixed"
                        // objectFit="contain"
                        onClick={() => {
                          handleImageModal(datum.image);
                        }}
                        quantity={5}
                        height="150px"
                        width="150px"
                        fallbackSrc={datum.image2}
                      />
                      {index === currentIndex ? (
                        <Transition
                          show={isHovering}
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <div
                            className={clsx(styles.carousel_btn_div, "visible")}
                          >
                            <button
                              onClick={() => {
                                payIndividualFee(currentName);
                              }}
                              className={styles.carousel_btn_pay}
                            >
                              Pay Fee
                            </button>
                            <button
                              onClick={() => {
                                handleImageModal(datum.image);
                              }}
                              className={styles.carousel_btn_view}
                            >
                              View
                            </button>
                          </div>
                        </Transition>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <button onClick={nextIndex}>
                <Icon color="#ffffff" icon="akar-icons:chevron-right" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                const id = parseInt(currentName.split("#")[1]);
                e.preventDefault();
                if (address) {
                  try {
                    const docRef = await setDoc(
                      doc(db, `users/${address}/${currentName}/${id}`),
                      {
                        defaultName: currentName,
                        changeName: input,
                        id,
                      }
                    );
                    inputRef.current.blur();
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  }
                }
              }}
            >
              <input
                className={styles.carousel__name}
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                style={{ background: "transparent" }}
                ref={inputRef}
              />
            </form>
            {/* <p className={styles.carousel__name}>{currentName}</p> */}
          </div>
        </div>

        {/* Text modal */}
        {isModalOpen && (
          <div className={styles.modal}>
            <button
              className={styles.modal__close}
              onClick={() => setModalState(false)}
            >
              <Icon color="#72799B" icon="ep:close" height={24} />
            </button>
            <div className={styles.modal__content}>
              <p className={styles.modal__heading}>Can I sell my NFTs?</p>
              <p className={styles.modal__body}>
                You are able to sell your NFTs at any time on Hexagon, our
                native NFT marketplace.
              </p>
              <p className={styles.modal__heading}>
                What is the MATIC fee that I have to pay?
              </p>
              <p className={styles.modal__body}>
                The Queen’s Tribute is a monthly maintenance fee that each bee
                contributes to – it amounts to 3 MATIC every 30 days per NFT you
                own.
              </p>
              <p className={styles.modal__heading}>
                Can I pay my maintenance fees in advance?
              </p>
              <p className={styles.modal__body}>
                Yes, you can pay your MATIC fees up to 90 days in advance.
              </p>
            </div>
          </div>
        )}

        {/* Filter modal */}
        {isFilterModalOpen && (
          <div className={styles.filter_modal}>
            {NFT_FILTERS.map(({ name, value, onQuery }) => (
              <div
                key={`filter_option_${value}`}
                className={styles.filter_modal__button}
                onClick={onQuery}
              >
                <span>{name}</span>
                {currentFilterSelection === value ? (
                  <img
                    alt="Button icon"
                    src="/assets/images/filter-button-icon-active.png"
                  />
                ) : (
                  <img
                    alt="Button icon"
                    src="/assets/images/filter-button-icon.png"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Image modal */}
        {isImageModalOpen !== null && (
          <div className={styles.image_modal}>
            <div className={styles.image_modal__content}>
              <img
                alt="Image"
                src={isImageModalOpen}
                className={styles.image_modal__content}
                onClick={() => setImageModalState(null)}
              />
            </div>
            <div
              className={styles.image_modal__overlay}
              onClick={() => setImageModalState(null)}
            ></div>
          </div>
        )}
      </div>
    </>
  );
}
function ImageFallback(props) {
  const { src, imgClass, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(false);
  const [oldSrc, setOldSrc] = useState(src);
  if (oldSrc !== src) {
    setImgSrc(false);
    setOldSrc(src);
  }
  return (
    <Image
      className={imgClass}
      {...rest}
      src={imgSrc ? fallbackSrc : src}
      alt={""}
      onError={() => {
        setImgSrc(true);
      }}
    />
  );
}
