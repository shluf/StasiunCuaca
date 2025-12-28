/**
 * Lungs Icon - Comfort Warning
 * Used for air quality and comfort alerts
 */

import type { SVGProps } from 'react';

export function LungsIcon(props: SVGProps<SVGSVGElement>) {
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
            <path d="M6.081 20C7.693 20 9.135 19.278 10 18" />
            <path d="M14 18c.865 1.278 2.307 2 3.919 2" />
            <path d="M12 4v2" />
            <path d="M11 6V4a2 2 0 1 0-4 0v1" />
            <path d="M7 5v-.5" />
            <path d="M13 6V4a2 2 0 1 1 4 0v1" />
            <path d="M17 5v-.5" />
            <path d="M10 6c-.32.85-.77 1.94-1.34 3.1C7.68 11.12 6 13.76 6 16.24c0 1.2.37 2.29 1 3.19" />
            <path d="M14 6c.32.85.77 1.94 1.34 3.1.98 2.02 2.66 4.66 2.66 7.14 0 1.2-.37 2.29-1 3.19" />
        </svg>
    );
}
