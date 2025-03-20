import { races } from './race_circuit';
import { describe, it, expect } from 'vitest';

describe('Race Circuit URLs', () => {
    // Skip URL validation in CI/CD environments
    if (process.env.CI) {
        it.skip('skipping URL validation in CI environment', () => {
            expect(true).toBe(true);
        });
        return;
    }

    // Test each race URL
    races.forEach(race => {
        // Skip races with null URLs
        if (race.url === null) {
            it.skip(`skipping ${race.name} - URL not yet available`, () => {
                expect(true).toBe(true);
            });
            return;
        }

        it(`should have valid URL for ${race.name}`, async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(race.url!, {
                    method: 'HEAD',
                    redirect: 'follow',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                // Check if status is 2xx or 3xx (success or redirect)
                expect(response.status).toBeLessThan(400);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                throw new Error(`Failed to access ${race.name} URL (${race.url}): ${errorMessage}`);
            }
        });
    });
}); 