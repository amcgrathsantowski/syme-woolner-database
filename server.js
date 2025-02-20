import { config } from 'dotenv';
import app from './api/api.js';
import { getNetworkIP } from './api/utils/index.js';

config();

const PORT = process.env.PORT || 1880;
const network_ips = getNetworkIP();

app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    network_ips.forEach((ip) => console.log(`http://${ip}:${PORT}`));
  }
});
