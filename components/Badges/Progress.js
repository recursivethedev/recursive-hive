
import progressHexagon from "./Progress.module.scss";

export default function Progress({ color, progress }) {

  // Note: Progress is a percent between 0-100
  const progressCalc = () => {
    if (!progress || progress < 1) return 2160
    if (progress === Number(100)) return 0
    const basis = 2160 / 100 * Number(progress)
    return 2160 - basis
  }

  return (
    <>
    <svg 
      width="104%" 
      height="104%" 
      viewBox="0 0 776 628" 
      style={{ position: 'absolute', top: '-3px', left: '-2px' }}
      className={progressHexagon}>
      <path 
        style={{ transform: 'translate(75px, 685px) rotate(-90deg)'}}
        fill="transparent" strokeWidth="30" stroke={color || "#5791ff"} strokeLinecap="round" strokeDasharray="2160" strokeDashoffset={progressCalc()} strokeLinejoin="round" d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"></path>
    </svg>
    </>
  )
}