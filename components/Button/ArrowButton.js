import clsx from "clsx";
import styles from "./Button.module.scss";

export default function ArrowButton(props) {
  const { arrowDirection, disabled, className, onClick, placement } = props;

  return (
    <button
      className={
        clsx(
          placement === "card" ? styles.buttonCard : styles.button,
          disabled ? styles.disabled : "",
          `inline-flex px-[15px] py-[10px] border-[1.5px] z-10 transition ${styles.buttonArrow}`,
          { 'rotate-180': arrowDirection === "right" },
          { 'px-[17px]': disabled },
          className
        )
      }
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      <svg className={clsx({ 'opacity-30': disabled })} width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.8823 1L5.94115 5.94118M0.999971 10.8824L10.8823 20.7647" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}