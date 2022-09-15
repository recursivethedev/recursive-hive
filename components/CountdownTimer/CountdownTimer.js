
// import Countdown from 'react-countdown';

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  return <span suppressHydrationWarning={true}>{days}d {hours}h {minutes}m {seconds}s</span>;
};

export default function CountdownTimer({ date }) {
  return (
    // <Countdown
    //   date={date}
    //   renderer={renderer}
    // />
    ""
  )
};