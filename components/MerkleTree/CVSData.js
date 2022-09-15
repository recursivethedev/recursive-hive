import * as Papa from "papaparse";
//convert cvs to array
export const CSVData = async () => {
  let arr = [];
  try {
    let responseText = await fetch("/whitelist.cvs");
    responseText = await responseText.text();

    var data = Papa.parse(responseText);

    const csv_data = data.data.slice(1, data.data.length - 1);

    csv_data.map((data) => {
      arr.push([...data][0]);
    });

    return arr;
  } catch (err) {
    console.log(err);
    return arr;
  }
};
