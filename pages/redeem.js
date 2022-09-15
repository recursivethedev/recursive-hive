import { ToastContainer } from "react-toastify";
import clsx from "clsx";
import Footer from "../components/Footer/Footer";
import Redeem from "../components/Redeem/Redeem";
import styles from "../components/Sidebar/Sidebar.module.scss";
import Topbar from "../components/Topbar/Topbar";
import Sidebar from "../components/Sidebar/Sidebar";

export default function RedeemPage() {
  return (
    <>
      <div className={styles.page}>
        <div className={styles.page__presale}>
          <Topbar AddButton={false} />
          <section className={styles.center}>
            <div className={styles.center__wrapper}>
              <Sidebar />
              <main className={clsx(styles.main, 'items-center')}>
                <div>
                  <Redeem />
                </div>
              </main>
            </div>
          </section>
          <Footer />
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
