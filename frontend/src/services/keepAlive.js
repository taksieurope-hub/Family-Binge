const BACKEND = "https://family-binge-backend.onrender.com";

export const startKeepAlive = () => {
  const ping = () => fetch(`${BACKEND}/`).catch(() => {});
  ping();
  setInterval(ping, 5 * 60 * 1000);
};
