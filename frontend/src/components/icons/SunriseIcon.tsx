/**
 * Sunrise Icon
 * Used for sunrise time display in forecast drawer
 */

import type { SVGProps } from 'react';

export function SunriseIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 2v8m-7.07 3.93 1.41 1.41M2 18h2m16 0h2m-3.07-4.66 1.41-1.41" />
      <circle cx="12" cy="18" r="4" />
      <path d="M2 22h20" />
    </svg>
  );
}
