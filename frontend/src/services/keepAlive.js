const BACKEND = "https://family-binge-g5hf.onrender.com";

export const startKeepAlive = () => {
  const ping = () => {
    fetch(`${BACKEND}/api/health`).catch(() => {});
    fetch(`${BACKEND}/`).catch(() => {});
  };
  ping();
  setInterval(ping, 10 * 60 * 1000); // every 10 minutes
};
