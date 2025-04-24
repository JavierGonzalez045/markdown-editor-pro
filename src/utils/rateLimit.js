/**
 * Utilidad de Rate Limiting
 *
 * Implemento un sistema de limitación de solicitudes para proteger
 * contra ataques DDoS y uso excesivo de recursos. Utilizo un caché
 * en memoria para rastrear las solicitudes por token.
 */
const rateLimit = ({ interval, uniqueTokenPerInterval = 500 } = {}) => {
  const tokenCache = new Map();

  return {
    check: (req, limit, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        const currentTime = Date.now();
        const windowStart = currentTime - interval;

        const requestsInWindow = tokenCount.filter(
          (timestamp) => timestamp > windowStart
        );

        requestsInWindow.push(currentTime);
        tokenCache.set(token, requestsInWindow);

        if (tokenCache.size > uniqueTokenPerInterval) {
          const oldestEntry = Array.from(tokenCache.entries()).sort(
            (a, b) => a[1][0] - b[1][0]
          )[0];
          tokenCache.delete(oldestEntry[0]);
        }

        const currentCount = requestsInWindow.length;
        const isRateLimited = currentCount > limit;

        if (isRateLimited) {
          reject(new Error("Rate limit exceeded"));
        } else {
          resolve();
        }
      }),
  };
};

export default rateLimit;
