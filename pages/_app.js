/* eslint-disable @next/next/no-page-custom-font */
import "../styles/global.scss";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import Web3Context from "../components/Context/Web3Context";
import Head from 'next/head';

const progress = new ProgressBar({
  size: 2,
  color: "#fdb813",
  className: "bar-of-progress",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
        <title>Hive Investments</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
          
          <link rel="shortcut icon" href="/favicon.ico?token=GHSAT0AAAAAABSEXAFFO66ED5IAFXFPCB7SYR3RASQ" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      </Head>

      <Web3Context>
        <Component {...pageProps} />
      </Web3Context>
    </>
  );
}

export default MyApp;
