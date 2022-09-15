export default function handler (req, res) {
  fetch('https://us-central1-hive-7229d.cloudfunctions.net/population')
  .then(res => res.json())
  .then(data => res.status(200).send(data)) 
}