// server.mjs
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/api/pvgis', async (req, res) => {
  try {
    const { lat, lon, endYear, database } = req.query;

    if (!lat || !lon || !endYear || !database) {
      return res.status(400).send("Missing parameters");
    }

    const startYear = "2005";
    const url = `https://re.jrc.ec.europa.eu/api/v5_3/MRcalc?lat=${lat}&lon=${lon}&startyear=${startYear}&endyear=${endYear}&raddatabase=${database}&horirrad=1&avtemp=1&d2g=1&outputformat=csv&browser=0`;

    const response = await fetch(url);
    const csvData = await response.text();

    res.setHeader('Content-Disposition', `attachment; filename=PVGIS_${database}_${lat}_${lon}_${startYear}-${endYear}.csv`);
    res.setHeader('Content-Type', 'text/csv');
    res.send(csvData);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`PVGIS Proxy running at http://localhost:${PORT}`);
});
