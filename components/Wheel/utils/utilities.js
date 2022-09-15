export function truncateBalance(balance) {
  let i;
  let result = "";
  let pointCrossed = false;

  for (i = 0; i < balance.length; ++i) {
    if (balance[i] !== '.') {
      result += balance[i];
    }
    else {
      pointCrossed = true;
      break;
    }
  }

  if (pointCrossed) {
    if (i + 1 < balance.length && balance[i + 1] !== "0") {
      result += '.';
      result += balance[i + 1];
    }
  }

  return result;
}
