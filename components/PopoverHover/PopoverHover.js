import { Fragment, useRef, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import styles from "./PopoverHover.module.scss";

export default function PopoverHover({ label = "Button", children }) {
  let timeout;
  const buttonRef = useRef(null);
  const [openState, setOpenState] = useState(false);

  const toggleMenu = (open) => {
    setOpenState((openState) => !openState);
    buttonRef?.current?.click(); // eslint-disable-line
  }

  const onHover = (open, action) => {
    if (
      (!open && !openState && action === "onMouseEnter") ||
      (open && openState && action === "onMouseLeave")
    ) {
      clearTimeout(timeout)
      timeout = setTimeout(() => toggleMenu(open), 100)
    }
  }

  const handleClick = open => {
    setOpenState(!open);
    clearTimeout(timeout);
  }

  const handleClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      event.stopPropagation()
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  });

  return (
    <Popover className="relative mx-auto w-[120px]">
      {({ open }) => (
        <div
          onMouseEnter={() => onHover(open, "onMouseEnter")}
          onMouseLeave={() => onHover(open, "onMouseLeave")}
          className="flex flex-col items-end"
        >
          <Popover.Button ref={buttonRef} className={styles.popoverButton}>
            <div
              className={clsx(styles.button, 'focus:ring-0')}
              onClick={() => handleClick(open)}
            >
              { label }
            </div>
          </Popover.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel static className="z-10 w-48 mx-auto">
              <div className={styles.popoverPanel}>
                {children}
              </div>
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  )
}
