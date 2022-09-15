import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Footer from "../components/Footer/Footer";
import Growth from "../components/Growth/Growth";
import Investments from "../components/Investments/Investments";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "../components/Sidebar/Sidebar_Portfolio.module.scss";
import Topbar from "../components/Topbar/Topbar";
import Tracker from "../components/Tracker/Tracker";

export default function PortfolioPage() {
  const [isMobileSidebarActivated, setIsMobileSidebarActivated] =
  useState(false);

  function toggleMobileSidebar() {
    setIsMobileSidebarActivated((state) => !state);
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.page__portfolio}>
          <Topbar AddButton={true} toggleMobileSidebar={toggleMobileSidebar} />
          <section className={styles.center}>
            <div className={styles.center__wrapper}>
              <div className={styles.sidebar__wrapper}>
                <Sidebar
                  isMobileSidebarActivated={isMobileSidebarActivated}
                  toggleMobileSidebar={toggleMobileSidebar}
                />
              </div>
              <main className={styles.main}>
                <div className={styles.column}>
                  <div className={styles['block__wrapper_half']}>
                    <Investments />
                  </div>
                  <div className={styles['block__wrapper_half']}>
                    <Growth />
                  </div>
                </div>
                <div className={styles.column}>
                  <div className={styles['block__wrapper_full']}>
                    <Tracker />
                  </div>
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
