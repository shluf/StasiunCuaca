/**
 * Temperature Icon - Thermometer
 * Used for temperature display in sensor cards
 */

import type { SVGProps } from 'react';

export function TemperatureIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
      <path d="M12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}
