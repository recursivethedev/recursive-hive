import clsx from "clsx";
import Footer from "../components/Footer/Footer";
import RedeemWhitelist from "../components/RedeemWhitelist/RedeemWhitelist";
import styles from "../components/Sidebar/Sidebar.module.scss";
import Topbar from "../components/Topbar/Topbar";

export default function SalePage() {
  return (
    <div className={styles.page}>
      <div className={styles.page__presale}>
        <Topbar AddButton={false} />
        <section className={clsx(styles.center, styles.center__vertical)}>
          <RedeemWhitelist />
        </section>
        <Footer />
      </div>
    </div>
  );
}
