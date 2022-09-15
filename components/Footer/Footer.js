/* eslint-disable jsx-a11y/anchor-is-valid */
import { Icon } from "@iconify/react";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <div className={styles.base}>
      <div className={styles.wrapper}>
        <div className={styles.socials}>
          <a
            href="https://twitter.com/hiveinvestments"
            rel="noreferrer"
            target="_blank"
          >
            <Icon color="#4ba9ff" icon="akar-icons:twitter-fill" />
          </a>

          {/* TODO: Update Telegram link */}
          {/* <a href="https://hive.investments/" rel="noreferrer" target="_blank">
            <Icon color="#4ba9ff" icon="cib:telegram-plane" />
          </a> */}

          {/* TODO: Update Discord link */}
          <a href="https://discord.gg/HiveInvestments" rel="noreferrer" target="_blank">
            <Icon color="#c1cdeb" icon="akar-icons:discord-fill" />
          </a>
        </div>
        <div
          className={styles.links}
          onClick={() => window?.open("/Hive_Disclaimer.pdf")}
        >
          {/* TODO: Update disclaimer link */}
          <a className={styles.link} href="">
            Disclaimer
          </a>
          {/* TODO: Update privacy policy link */}
        </div>
      </div>
    </div>
  );
}
