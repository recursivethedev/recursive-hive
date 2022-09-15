/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/router";

import { Web3ContextApi } from "../Context/Web3Context";
import styles from "./Topbar.module.scss";
import { Icon } from "@iconify/react";
// import WarningIcon from "../Icons/WarningIcon";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import PopoverHover from "../PopoverHover/PopoverHover";
import BlackTooltip from "../BlackTooltip/BlackTooltip";

export default function Topbar({ AddButton, toggleMobileSidebar }) {
  const { pathname } = useRouter();
  const { contextValue, connect, disconnect } = useContext(Web3ContextApi);
  const {
    state: { address },
  } = contextValue;

  var endDate = new Date("2022-04-04T23:20:01Z")
  var currentDate = new Date();

  let formattedAddress;
  if (address)
    formattedAddress = address?.substr(0, 3) + "..." + address?.substr(-2);

  const addToken = async () => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: "0x1FA2F83BA2DF61c3d370071d61B17Be01e224f3a", // The address that the token is at.
            symbol: "HNY", // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
            image: `${window.location}/assets/images/HNY.png`, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.base}>
      <div className={styles.wrapper}>
        <div className={styles.brand}>
          <Link href="https://hive.investments">
            <img
              alt="Hive Investments logo"
              className={styles.logo}
              draggable={false}
              src="/assets/images/logo.png"
            />
          </Link>
          <button className={styles.menu} onClick={toggleMobileSidebar}>
            <Icon color="#ffffff" height="32" icon="ant-design:menu-outlined" />
          </button>
        </div>

        {/* {pathname !== "/whitelist" && (
          <div className="message-panel py-4 px-4 mx-2">
            <WarningIcon className="w-[18px] text-white mr-2 lg:mr-3" />
            <span className="text-white text-xs">
              Temporary enhanced sales tax rate:
            </span>
            <span className="text-white text-sm ml-2 font-bold">{(((((endDate.getTime() - currentDate.getTime())*300)/518400000)+150)/10).toFixed(2)}%</span>
            <span className="text-[#72799B] text-sm mx-5 font-bold w-[125px] inline-block">
              <CountdownTimer date={endDate} />
            </span>
            <Link href="#">
              <a className="text-[#60adff] hover:underline text-sm pr-3 font-medium" href="https://medium.com/@hiveinvestments/x-hivelist-launch-strategy-the-moment-youve-all-been-buzzing-for-581203ac5f57" target="_blank">
                Learn more
              </a>
            </Link>
          </div>
        )} */}

        <div className={styles.buttons}>
          {/* TODO: Implement add tokens */}
          {AddButton && (
            <PopoverHover label="$HNY">
              <a 
                href="https://app.sushi.com/swap?chainId=137&tokens=0x1FA2F83BA2DF61c3d370071d61B17Be01e224f3a&tokens=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
                target="_blank"
                rel="noreferrer"
              >
                BUY $HNY
              </a>
              <button onClick={addToken}>
                ADD TOKEN
              </button>
            </PopoverHover>
          )}
          {/* TODO: Implement connect wallet */}
          <BlackTooltip title={address ? "disconnect" : "connect"}>
            <button
              className={styles.button}
              onClick={address ? disconnect : connect}
            >
              <Icon className={styles.metamask} icon="logos:metamask-icon" />
              {address ? formattedAddress : "connect"}
            </button>
          </BlackTooltip>
        </div>
      </div>
    </div>
  );
}
