/* eslint-disable jsx-a11y/anchor-is-valid */
import { Icon } from "@iconify/react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Sidebar.module.scss";
import { useState } from "react";
import RubicModal from "../Modals/RubicModal";

export default function Sidebar(props) {
  const [showRubicModal, setShowRubicModal] = useState(false);
  function CustomLink({ icon, path, text, disabled }) {
    const router = useRouter();
    const isActive = path === router.asPath ? true : false;
    return (
      <Link href={path} className={styles.link}>
        <a className={clsx(styles.link, { [styles.active]: isActive }, { 'pointer-events-none cursor-default' : disabled })}>
          <Icon icon={icon} />
          <span>{text}</span>
          <div></div>
        </a>
      </Link>
    );
  }
  
  function CustomLinkOut({ icon, isMediumIcon, path, text, onClick }) {
    const router = useRouter();
    const isActive = path === router.asPath ? true : false;
    return (
      <Link href="" className={styles.link}>
        <a
          target="_blank"
          href={path}
          rel="noopener noreferrer"
          className={clsx(styles.link, { [styles.active]: isActive })}
          onClick={onClick}
        >
          <Icon icon={icon} className={clsx({ [styles.mediumIcon]: isMediumIcon })} />
          <span>{text}</span>
          <div></div>
        </a>
      </Link>
    );
  }
function toggleRubic() {
  setShowRubicModal(true)
  {props.isMobileSidebarActivated && props.toggleMobileSidebar()}
}

  return (
    <>
    <aside
      className={clsx(styles.base, {
        [styles.base___active]: props.isMobileSidebarActivated,
      })}
    >
      <button className={styles.close} onClick={props.toggleMobileSidebar}>
        <Icon color="#ffffff" height="32" icon="ep:close-bold" />
      </button>

      <CustomLink icon="charm:home" path="/" text="Dashboard" />
      <CustomLink
        icon="charm:chart-line"
        path="/portfolio"
        text="Investment portfolio"
      />
      <CustomLinkOut
        icon="mdi:hexagon-outline"
        isMediumIcon
        path="https://hexagon.trade"
        text="Hexagon"
      />
      <CustomLinkOut
        icon="charm:book"
        path="https://hive.investments/whitepaper.pdf"
        text="Whitepaper"
      />
      <CustomLinkOut
        icon="charm:person"
        path="https://www.assuredefi.io/projects/hive-investments/"
        text="KYC"
      />
      <CustomLinkOut
        icon="charm:shield-tick"
        path="https://www.certik.com/projects/hive-investments"
        text="Audit"
      />
      
      
      <CustomLinkOut
        icon="charm:swap-horizontal"
        text="Exchange"
        onClick={() => toggleRubic()}
      />
      <CustomLink
        icon="charm:chart-line"
        path="/wheel"
        text="Wheel of Fortune"
      />
      
      {/* <p className={styles.heading}>Administration</p>
      <CustomLink icon="charm:link" path="/connect" text="Connect app" /> */}
    </aside>
    <RubicModal
        isOpen={showRubicModal}
        onClose={() => setShowRubicModal(false)}
      />
    </>
    
  );
}


