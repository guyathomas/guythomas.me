import React from "react"

interface ClockProps {
  fastForward?: boolean
}

export const Clock: React.FC<ClockProps> = ({ fastForward }) => (
  <svg viewBox="0 0 60 60" version="1.1">
    <g id="Forward" fill="none" transform="translate(12.000000, 12.000000)">
      <g id="Group" strokeWidth="3">
        <path
          d="M36,18 C36,8.0588745 27.9411255,0 18,0 C8.0588745,0 0,8.0588745 0,18 C0,27.9411255 8.0588745,36 18,36"
          id="Path"
        ></path>
      </g>
      <polygon
        id="Triangle"
        fill="inherit"
        strokeWidth="4"
        stroke="inherit"
        transform="translate(36.000000, 21.000000) scale(1, -1) translate(-36.000000, -21.000000) "
        points="36 18 39 24 33 24"
      ></polygon>
    </g>
    <line
      id="hour-hand"
      className={fastForward ? "fast-forward" : ""}
      x1="30.5"
      y1="29.5"
      x2="36"
      y2="35"
      strokeWidth="3"
      strokeLinecap="round"
    ></line>
    <line
      id="minute-hand"
      className={fastForward ? "fast-forward" : ""}
      x1="30.5"
      y1="29.5"
      x2="30.5"
      y2="17.5"
      strokeWidth="3"
      strokeLinecap="round"
    ></line>
  </svg>
)
