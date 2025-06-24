import * as React from "react";

import { IconSvgProps } from "@/types";

export const Logo: React.FC<IconSvgProps> = ({
    size = 36,
    width,
    height,
    ...props
}) => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="36" zoomAndPan="magnify" viewBox="0 0 810 809.999993" height="1080" preserveAspectRatio="xMidYMid meet" version="1.2">
        <defs />
        <g id="73f3272c77">
            <rect x="0" width="810" y="0" height="809.999993" style={{ fill: "#ffffff", fillOpacity: 1, stroke: "none" }} />
            <rect x="0" width="810" y="0" height="809.999993" style={{ fill: "#000000", fillOpacity: 1, stroke: "none" }} />
            <g style={{ fill: "#ffffff", fillOpacity: 1 }}>
                <g transform="translate(257.399405, 545.249993)">
                    <path style={{ stroke: "none" }} d="M 8 -65.59375 L 28 -65.59375 L 28 -245.59375 L 8 -245.59375 L 8 -311.203125 L 183.59375 -311.203125 C 218 -311.203125 244.265625 -303.800781 262.390625 -289 C 280.523438 -274.195312 289.59375 -250.265625 289.59375 -217.203125 C 289.59375 -184.128906 280.523438 -160.191406 262.390625 -145.390625 C 244.265625 -130.597656 218 -123.203125 183.59375 -123.203125 L 140 -123.203125 L 140 -65.59375 L 178.40625 -65.59375 L 178.40625 0 L 8 0 Z M 153.59375 -180 C 169.0625 -180 176.796875 -188.53125 176.796875 -205.59375 L 176.796875 -220 C 176.796875 -228.800781 174.863281 -235.265625 171 -239.390625 C 167.132812 -243.523438 161.332031 -245.59375 153.59375 -245.59375 L 140 -245.59375 L 140 -180 Z M 153.59375 -180 " />
                </g>
            </g>
        </g>
    </svg>
);

export const MoonFilledIcon = ({
    size = 24,
    width,
    height,
    ...props
}: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
            fill="currentColor"
        />
    </svg>
);

export const SunFilledIcon = ({
    size = 24,
    width,
    height,
    ...props
}: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <g fill="currentColor">
            <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
            <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
        </g>
    </svg>
);

export const HeartFilledIcon = ({
    size = 24,
    width,
    height,
    ...props
}: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
            fill="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
        />
    </svg>
);


export const HeartSlashIcon = ({
    size = 24,
    width,
    height,
    ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg
        aria-hidden="true"
        focusable="false"
        role="presentation"
        viewBox="0 0 24 24"
        width={width ?? size}
        height={height ?? size}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g>
            <path fill="none" d="M0 0H24V24H0z" />
            <path d="M2.808 1.393l18.384 18.385-1.414 1.414-3.747-3.747L12 21.485 3.52 12.993c-2.04-2.284-2.028-5.753.034-8.023L1.393 2.808l1.415-1.415zm2.172 10.23L12 18.654l2.617-2.623-9.645-9.645c-1.294 1.497-1.3 3.735.008 5.237zm15.263-6.866c2.262 2.268 2.34 5.88.236 8.236l-1.635 1.636-1.414-1.414 1.59-1.592c1.374-1.576 1.299-3.958-.193-5.453-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-.35-.314-.741-.555-1.155-.723l-2.25-2.25c1.668-.206 3.407.289 4.74 1.484 2.349-2.109 5.979-2.039 8.242.228z" />
        </g>
    </svg>
);

export const TrashIcon = ({
    size = 24,
    width,
    height,
    ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width ?? size}
        height={height ?? size}
        viewBox="0 0 360 360"
        preserveAspectRatio="xMidYMid meet"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        role="presentation"
        {...props}
    >
        <defs>
            <clipPath id="clip">
                <path d="M 109 324 L 251 324 L 251 326.25 L 109 326.25 Z M 109 324 " />
            </clipPath>
        </defs>
        <g>
            <path d="M297 71.32H234V45a9 9 0 0 0-9-9H135a9 9 0 0 0-9 9v26.32H63a9 9 0 0 0-9 9v18a9 9 0 0 0 9 9h234a9 9 0 0 0 9-9v-18a9 9 0 0 0-9-9zM93.6 316.13c.45 4.5 4.28 7.88 9 7.88h155.03c4.5 0 8.32-3.38 9-7.88L288.23 126.23H72zm122.4-29.25 15.75-125.77a9 9 0 0 1 17.85 2.25l-15.75 125.77a9 9 0 0 1-8.88 7.12h-.38a9 9 0 0 1-8.59-9.62zM171 162.23a9 9 0 0 1 18 0v125.77a9 9 0 0 1-18 0zm-52.88-9c4.95-.68 9.45 2.93 10.13 7.89l15.75 125.77a9 9 0 0 1-17.86 2.25l-15.75-125.77a9 9 0 0 1 7.73-10.14z" />
            <g clipPath="url(#clip)">
                <path d="M250.72 325.13c0 .62-.52 1.12-1.17 1.12H110.45a1.12 1.12 0 1 1 0-2.25h139.1c.65 0 1.17.5 1.17 1.13z" />
            </g>
        </g>
    </svg>
);

export const EditIcon = ({
    size = 24,
    width,
    height,
    ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width ?? size}
        height={height ?? size}
        viewBox="0 0 360 360"
        preserveAspectRatio="xMidYMid meet"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        role="presentation"
        {...props}
    >
        <defs>
            <clipPath id="e1fb32bffe">
                <path d="M 109 321.660156 L 251 321.660156 L 251 323.910156 L 109 323.910156 Z M 109 321.660156 " />
            </clipPath>
        </defs>
        <g id="e716c38c8a">
            <g clipPath="url(#e1fb32bffe)">
                <path
                    style={{
                        stroke: 'none',
                        fillRule: 'nonzero',
                        fill: 'currentColor',
                        fillOpacity: 1,
                    }}
                    d="M 250.71875 322.785156 C 250.71875 323.40625 250.195312 323.910156 249.550781 323.910156 L 110.449219 323.910156 C 109.804688 323.910156 109.28125 323.40625 109.28125 322.785156 C 109.28125 322.164062 109.804688 321.660156 110.449219 321.660156 L 249.550781 321.660156 C 250.195312 321.660156 250.71875 322.164062 250.71875 322.785156 Z"
                />
            </g>
            <path
                style={{
                    fill: 'none',
                    strokeWidth: 1,
                    strokeLinecap: 'butt',
                    strokeLinejoin: 'round',
                    stroke: 'currentColor',
                    strokeOpacity: 1,
                    strokeMiterlimit: 4,
                }}
                d="M 14.499959 3.99996 L 3.999959 3.99996 C 2.895385 3.99996 1.999878 4.895467 1.999878 6.000041 L 1.999878 20.000041 C 1.999878 21.104615 2.895385 22.000123 3.999959 22.000123 L 17.999959 22.000123 C 19.104533 22.000123 20.000041 21.104615 20.000041 20.000041 L 20.000041 9.500041"
                transform="matrix(13.714285,0,0,13.714285,15.428577,15.42857)"
            />
            <path
                style={{
                    fill: 'none',
                    strokeWidth: 1,
                    strokeLinecap: 'butt',
                    strokeLinejoin: 'round',
                    stroke: 'currentColor',
                    strokeOpacity: 1,
                    strokeMiterlimit: 4,
                }}
                d="M 22.000122 3.99996 L 20.000041 1.999878 L 12 9.999919 L 10.999959 13.000041 L 14.000081 12 Z"
                transform="matrix(13.714285,0,0,13.714285,15.428577,15.42857)"
            />
        </g>
    </svg>
);

export const SaveIcon = ({
    size = 24,
    width,
    height,
    ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width ?? size}
        height={height ?? size}
        viewBox="0 0 360 360"
        preserveAspectRatio="xMidYMid meet"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        role="presentation"
        {...props}
    >
        <defs>
            <clipPath id="f25187d0dd">
                <path d="M 109 321.660156 L 251 321.660156 L 251 323.910156 L 109 323.910156 Z" />
            </clipPath>
            <clipPath id="8d549033bf">
                <path d="M 47 36 L 313.230469 36 L 313.230469 324 L 47 324 Z" />
            </clipPath>
        </defs>
        <g>
            <g clipPath="url(#f25187d0dd)">
                <path
                    d="M 250.71875 322.785156 C 250.71875 323.40625 250.195312 323.910156 249.550781 323.910156 L 110.449219 323.910156 C 109.804688 323.910156 109.28125 323.40625 109.28125 322.785156 C 109.28125 322.164062 109.804688 321.660156 110.449219 321.660156 L 249.550781 321.660156 C 250.195312 321.660156 250.71875 322.164062 250.71875 322.785156 Z"
                    fill="currentColor"
                />
            </g>
            <g clipPath="url(#8d549033bf)">
                <path
                    d="M 239.546875 36 L 80.332031 36 C 55.933594 36 47.078125 55.871094 47.078125 69.230469 L 47.078125 290.769531 C 47.078125 315.148438 66.964844 324 80.332031 324 L 279.875 324 C 304.277344 324 313.132812 304.128906 313.132812 290.769531 L 313.132812 97.277344 Z M 113.589844 58.152344 L 169.019531 58.152344 L 169.019531 102.460938 L 202.277344 102.460938 L 202.277344 58.152344 L 224.449219 58.152344 L 224.449219 113.539062 C 224.449219 122.457031 218.351562 124.484375 213.363281 124.617188 L 124.675781 124.617188 C 115.753906 124.617188 113.722656 118.523438 113.589844 113.539062 Z M 246.621094 301.847656 L 113.589844 301.847656 L 113.589844 213.230469 L 246.621094 213.230469 Z M 290.960938 290.636719 C 290.828125 295.753906 288.8125 301.847656 279.875 301.847656 L 268.789062 301.847656 L 268.789062 191.078125 L 91.417969 191.078125 L 91.417969 301.847656 L 80.464844 301.847656 C 75.34375 301.714844 69.246094 299.695312 69.246094 290.769531 L 69.246094 69.363281 C 69.382812 64.246094 71.410156 58.152344 80.332031 58.152344 L 91.417969 58.152344 L 91.417969 113.539062 C 91.417969 126.898438 100.277344 146.769531 124.675781 146.769531 L 213.363281 146.769531 C 226.730469 146.769531 246.621094 137.917969 246.621094 113.539062 L 246.621094 70.726562 L 290.960938 107.644531 Z M 224.449219 257.539062 L 135.761719 257.539062 L 135.761719 235.382812 L 224.449219 235.382812 Z"
                    fill="currentColor"
                />
            </g>
        </g>
    </svg>
);

export const CancelIcon = ({
    size = 24,
    width,
    height,
    ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width ?? size}
        height={height ?? size}
        viewBox="0 0 360 360"
        preserveAspectRatio="xMidYMid meet"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        role="presentation"
        {...props}
    >
        <defs>
            <clipPath id="cancel_clip">
                <path d="M 109 321.660156 L 251 321.660156 L 251 323.910156 L 109 323.910156 Z" />
            </clipPath>
        </defs>
        <g>
            <g clipPath="url(#cancel_clip)">
                <path
                    d="M 250.71875 322.785156 C 250.71875 323.40625 250.195312 323.910156 249.550781 323.910156 L 110.449219 323.910156 C 109.804688 323.910156 109.28125 323.40625 109.28125 322.785156 C 109.28125 322.164062 109.804688 321.660156 110.449219 321.660156 L 249.550781 321.660156 C 250.195312 321.660156 250.71875 322.164062 250.71875 322.785156 Z"
                    fill="currentColor"
                />
            </g>
            <path
                d="M 198.054688 180.046875 L 252.0625 126.035156 C 257.035156 121.066406 257.042969 112.996094 252.070312 108.023438 C 247.109375 103.0625 239.035156 103.054688 234.058594 108.03125 L 180.046875 162.039062 L 126.039062 108.03125 C 121.070312 103.0625 112.996094 103.050781 108.023438 108.023438 C 103.0625 112.984375 103.054688 121.058594 108.03125 126.035156 L 162.042969 180.046875 L 108.03125 234.054688 C 103.0625 239.027344 103.050781 247.097656 108.023438 252.070312 C 112.988281 257.03125 121.0625 257.039062 126.039062 252.0625 L 180.046875 198.050781 L 234.058594 252.0625 C 239.027344 257.03125 247.101562 257.042969 252.070312 252.070312 C 257.035156 247.109375 257.039062 239.03125 252.0625 234.054688 Z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </g>
    </svg>
);

export const UndoIcon = ({
    size = 24,
    width,
    height,
    ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width ?? size}
        height={height ?? size}
        viewBox="0 0 360 360"
        preserveAspectRatio="xMidYMid meet"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        role="presentation"
        {...props}
    >
        <defs>
            <clipPath id="undo_line_clip">
                <path d="M 109 294.703125 L 251 294.703125 L 251 296.953125 L 109 296.953125 Z" />
            </clipPath>
            <clipPath id="undo_main_clip">
                <path d="M 36 36 L 321.75 36 L 321.75 321.75 L 36 321.75 Z" />
            </clipPath>
        </defs>
        <g>
            <g clipPath="url(#undo_line_clip)">
                <path
                    d="M 250.71875 295.828125 C 250.71875 296.449219 250.195312 296.953125 249.550781 296.953125 L 110.449219 296.953125 C 109.804688 296.953125 109.28125 296.449219 109.28125 295.828125 C 109.28125 295.207031 109.804688 294.703125 110.449219 294.703125 L 249.550781 294.703125 C 250.195312 294.703125 250.71875 295.207031 250.71875 295.828125 Z"
                    fill="currentColor"
                />
            </g>
            <g clipPath="url(#undo_main_clip)">
                <path
                    d="M 178.539062 36.113281 C 137.050781 36.113281 99.574219 53.734375 73.476562 82.0625 L 53.398438 69.347656 C 51.835938 68.457031 50.277344 68.011719 48.714844 68.011719 C 44.253906 68.011719 40.015625 71.578125 39.792969 76.488281 L 36.222656 156.566406 C 36 161.921875 40.460938 165.9375 45.144531 165.9375 C 46.484375 165.9375 47.824219 165.714844 49.382812 164.820312 L 120.765625 127.570312 C 126.789062 124.445312 127.234375 115.746094 121.433594 112.175781 L 104.480469 101.46875 C 123.664062 83.179688 149.765625 71.800781 178.539062 71.800781 C 237.875 71.800781 286.058594 119.761719 286.058594 178.875 C 286.058594 237.988281 237.875 285.949219 178.761719 285.949219 C 122.773438 285.949219 76.820312 243.117188 71.914062 188.691406 L 38.007812 206.089844 C 50.722656 271.894531 108.71875 321.636719 178.539062 321.636719 C 257.507812 321.636719 321.75 257.617188 321.75 178.875 C 321.75 100.132812 257.730469 36.113281 178.539062 36.113281 Z"
                    fill="currentColor"
                />
            </g>
        </g>
    </svg>
);

export const SendIcon = ({
    size = 24,
    width,
    height,
    ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width ?? size}
        height={height ?? size}
        viewBox="0 0 360 360"
        preserveAspectRatio="xMidYMid meet"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        role="presentation"
        {...props}
    >
        <defs>
            <clipPath id="send_clip_1">
                <path d="M 118 96 L 242 96 L 242 169 L 118 169 Z" />
            </clipPath>
            <clipPath id="send_clip_2">
                <path d="M 117.078125 167.40625 L 241.757812 95.355469 L 242.882812 97.304688 L 118.203125 169.355469 Z" />
            </clipPath>
        </defs>
        <g>
            <g clipPath="url(#send_clip_1)">
                <g clipPath="url(#send_clip_2)">
                    <path
                        d="M 241.210938 96.972656 C 241.519531 97.511719 241.320312 98.207031 240.761719 98.53125 L 120.324219 168.128906 C 119.765625 168.453125 119.0625 168.277344 118.75 167.738281 C 118.4375 167.199219 118.640625 166.503906 119.195312 166.179688 L 239.636719 96.582031 C 240.195312 96.261719 240.898438 96.433594 241.210938 96.972656 Z"
                        fill="currentColor"
                    />
                </g>
            </g>
            <path
                d="M 42.226562 143.699219 L 303.457031 50.191406 C 313.902344 46.457031 323.980469 56.539062 320.183594 66.972656 L 233.277344 305.316406 C 230.648438 312.472656 220.863281 313.339844 216.992188 306.847656 L 157.179688 205.449219 C 154.695312 201.21875 155.566406 195.738281 159.300781 192.460938 L 249.484375 113.691406 C 250.4375 112.894531 249.339844 111.351562 248.246094 112.085938 L 147.753906 175.742188 C 144.25 178.007812 139.945312 178.742188 135.847656 177.789062 L 42.300781 156.914062 C 36.019531 154.792969 35.949219 145.890625 42.226562 143.699219 Z"
                fill="currentColor"
            />
            <path
                d="M 141.476562 208.808594 L 141.476562 281.222656 C 141.476562 285.898438 145.5625 287.570312 148.851562 284.4375 L 173.515625 260.914062 C 174.25 259.527344 174.25 257.769531 173.515625 256.386719 L 148.851562 206.617188 C 146.875 202.460938 141.476562 204.136719 141.476562 208.808594 Z"
                fill="currentColor"
            />
        </g>
    </svg>
);

export const CheckIcon = ({ className = 'w-5 h-5', ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-check-icon ${className}`}
        {...props}
    >
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

export const MailIcon = ({
    className = 'w-5 h-5',
    ...props
}: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-mail-icon ${className}`}
        {...props}
    >
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
        <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
);

export const MessageCircleIcon = ({
    className = 'w-5 h-5',
    ...props
}: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-message-circle-icon ${className}`}
        {...props}
    >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
);

export const ClipboardIcon = ({
    className = 'w-5 h-5',
    ...props
}: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-clipboard-icon ${className}`}
        {...props}
    >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
);
