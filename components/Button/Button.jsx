import Link from "next/link";
import styles from "./Button.module.scss";

export default function Button({
  className,
  active,
  disabled,
  minimal,
  children,
  href,
  target,
  onClick,
}) {
  return typeof onClick === "function" ? (
    <button
      onClick={onClick}
      className={`inline-flex ${
        minimal ? `px-8 py-2 ${styles.minimal}` : "px-8 py-4"
      } ${styles.button} ${active ? styles.active : ""} ${
        disabled ? "disabled" : ""
      } ${className ? className : ""} transition`}>
      <span className="text-white uppercase text-xs font-semibold tracking-[.1em]">
        {children}
      </span>
    </button>
  ) : (
    <Link href={href ? href : "#"}>
      <a
        target={target ? target : "_self"}
        className={`inline-flex ${
          minimal ? `px-8 py-2 ${styles.minimal}` : "px-8 py-4"
        } ${styles.button} ${active ? styles.active : ""} ${
          disabled ? "disabled" : ""
        } ${className ? className : ""} transition`}>
        <span className="text-white uppercase text-xs font-semibold tracking-[.1em]">
          {children}
        </span>
      </a>
    </Link>
  );
}
