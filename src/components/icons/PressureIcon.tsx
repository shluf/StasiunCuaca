/**
 * Pressure Icon - Gauge/Barometer
 * Used for air pressure display in sensor cards
 */

import type { SVGProps } from 'react';

export function PressureIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 16v4m-8-4a8 8 0 1 1 16 0" />
      <path d="m8 12 2 2 4-4" />
    </svg>
  );
}
