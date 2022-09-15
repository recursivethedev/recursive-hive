import axios from 'axios'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const holdings = await axios.get(process.env.API_URL_PORTFOLIO + '/holdings', {
      params: req.query
    })
    res.send(holdings.data)
  }
}