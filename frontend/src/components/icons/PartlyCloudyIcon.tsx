/**
 * Partly Cloudy Weather Icon
 * Used for partly cloudy weather condition display
 */

import type { SVGProps } from 'react';

export function PartlyCloudyIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M13 2v2m4.14.86 1.42 1.42M22 13h-2m-1.14 4.14-1.42 1.42" />
      <circle cx="15" cy="11" r="4" />
      <path d="M7 19a5 5 0 1 1 7-5h3a3 3 0 0 1 0 6H7Z" />
    </svg>
  );
}
