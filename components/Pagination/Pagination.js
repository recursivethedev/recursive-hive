import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import styles from './Pagination.module.scss';

export default function Pagination({ highestPage, pageChanged }) {
  const [currentSlug, setSlug] = useState(0);
  const numbersRef = useRef(null);

  useEffect(() => {
    pageChanged(currentSlug)
  }, [currentSlug])

  // Decrease by 1
  function decrease() {
    const newSlug = currentSlug - 1;
    if (newSlug > -1) {
      setSlug(newSlug);
    }
  }

  // Increase by 1
  function increase() {
    const newSlug = currentSlug + 1;
    if (newSlug < highestPage) {
      setSlug(newSlug);
    }
  }

  return (
    <div className={styles.base}>
      <div className={styles.pagination}>
        <button className={styles.button} onClick={decrease}>
          <Icon icon="akar-icons:chevron-left" />
        </button>
        <div className={styles.numbers} ref={numbersRef}>
          { [...Array(highestPage + 1)].map((pageNum, i) => {
            return <div 
            key={i}
            className={styles.number} 
            data-active={currentSlug === i}
            onClick={() => setSlug(i)}
            >{i + 1}</div>
          })
          }
        </div>
        <button className={styles.button} onClick={increase}>
          <Icon icon="akar-icons:chevron-right" />
        </button>
      </div>
    </div>
  );
}
