package com.example.Animeverse_JAVA.Util;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

public class RateLimiter {
    private final int maxRequests;
    private final Duration timeWindow;
    private final Semaphore semaphore;
    private Instant windowStart;
    private int requestCount;

    public RateLimiter(int maxRequests, Duration timeWindow) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.semaphore = new Semaphore(1);
        this.windowStart = Instant.now();
        this.requestCount = 0;
    }

    public void acquire() throws InterruptedException {
        semaphore.acquire();
        try {
            Instant now = Instant.now();
            if (Duration.between(windowStart, now).compareTo(timeWindow) >= 0) {
                // Reset the window
                windowStart = now;
                requestCount = 0;
            }

            if (requestCount >= maxRequests) {
                // Calculate when we can make the next request
                Instant nextWindow = windowStart.plus(timeWindow);
                long sleepMillis = Duration.between(now, nextWindow).toMillis();
                if (sleepMillis > 0) {
                    TimeUnit.MILLISECONDS.sleep(sleepMillis);
                }
                // Reset the window after sleeping
                windowStart = Instant.now();
                requestCount = 0;
            }
            requestCount++;
        } finally {
            semaphore.release();
        }
    }
}
