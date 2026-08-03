const BACKEND = "https://family-binge-backend-2q4n.onrender.com";

export const startKeepAlive = () => {
  const ping = () => {
    fetch(`${BACKEND}/api/health`).catch(() => {});
    fetch(`${BACKEND}/`).catch(() => {});
  };
  ping();
  setInterval(ping, 10 * 60 * 1000); // every 10 minutes
};
