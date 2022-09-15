import { useEffect, useRef } from 'react';

import styles from './Notification.module.css';

export default function Notification(props) {
  const notificationRef = useRef();

  const isNotError = (props.message === "Please wait for the approval transaction to succeed, then continue to spin the wheel." || props.message === "Allow 1-3 minutes for the result to be generated via API3.");

  useEffect(() => {
    if (props.message !== "") {
      notificationRef.current.style.opacity = 1;
      notificationRef.current.style.top = "30px";
      setTimeout(() => {
        notificationRef.current.style.opacity = 0;
        notificationRef.current.style.top = "15px";
        setTimeout(() => props.setMessage(''), 1000);
      }, (isNotError ? 6000 : 3500));
    }
  }, [props.message]);

  return (
    <div className={styles.notificationWrapper} style={{ opacity: 0, backgroundImage: (isNotError ? 'linear-gradient(20deg, #88b528, #00b35c)' : null) }} ref={notificationRef}>
      <p className={styles.notificationText}>{props.message}</p>
    </div>
  );
}
