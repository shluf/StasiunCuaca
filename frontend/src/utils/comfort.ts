export function clamp(v: number, min = 0, max = 1) {
    return Math.max(min, Math.min(max, v));
}

export function calculateComfortIndex(temp: number, hum: number) {
    // Ideal conditions: Temp 26°C, Humidity 60%
    const tempScore = clamp(1 - Math.abs(temp - 26) / 10);
    const humScore = clamp(1 - Math.abs(hum - 60) / 40);

    // Weighted score: 60% Temp, 40% Humidity
    const index = (0.6 * tempScore + 0.4 * humScore) * 100;

    return Math.round(index);
}

export type ComfortLevel = 'very_comfortable' | 'comfortable' | 'less_comfortable' | 'uncomfortable';

export function comfortLabel(index: number): ComfortLevel {
    if (index >= 80) return 'very_comfortable';
    if (index >= 65) return 'comfortable';
    if (index >= 50) return 'less_comfortable';
    return 'uncomfortable';
}
