import { networkInterfaces } from 'os';

/**
 * Gets the IP address of the network interfaces. Intended for development only.
 *
 * @returns {string[]} - Returns an array of strings containing the IP addresses of the network interfaces.
 */
function getNetworkIP() {
  const nets = networkInterfaces();
  const results = {};
  Object.keys(nets).forEach((name) => {
    nets[name].forEach((net) => {
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    });
  });
  const ips = Object.values(results);
  return ips;
}

export default getNetworkIP;
