import axios from 'axios'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const snapshots = await axios.get(process.env.API_URL_PORTFOLIO + '/treasury', {
      params: req.query
    })
    res.send(snapshots.data)
  }
}