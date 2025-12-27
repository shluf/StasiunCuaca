/**
 * Stormy/Thunder Weather Icon
 * Used for thunderstorm weather condition display
 */

import type { SVGProps } from 'react';

export function StormyIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M13 11 9 17h4l-2 4" />
    </svg>
  );
}
