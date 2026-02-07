import * as React from 'react'

export interface PawIconProps extends React.SVGProps<SVGSVGElement> {}

export function PawIcon(props: PawIconProps) {
  return (
    <svg viewBox="0 0 128 128" role="img" aria-label="Paw loader" {...props}>
      <style>{`
        .paw-bean {
          fill: currentColor;
          transform-box: fill-box;
          transform-origin: center;
          animation-name: paw-pop;
          animation-duration: 1.3s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        /* keep the pop subtle so shapes never “merge” */
        .paw-toe { --s: 1.10; }
        .paw-pad { --s: 1.08; }

        /* left → right → pad */
        /* use explicit classes for delay to prevent specificity issues */
        .paw-b1 { animation-delay: 0s; }
        .paw-b2 { animation-delay: 0.16s; }
        .paw-b3 { animation-delay: 0.32s; }
        .paw-b4 { animation-delay: 0.48s; }
        .paw-b5 { animation-delay: 0.64s; }

        @keyframes paw-pop {
          0% { transform: scale(1); }
          16% { transform: scale(var(--s, 1.08)); }
          32% { transform: scale(1); }
          100% { transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .paw-bean { animation: none; }
        }
      `}</style>

      <ellipse
        className="paw-bean paw-toe paw-b1"
        cx="24"
        cy="52"
        rx="9"
        ry="14"
        transform="rotate(-25 24 52)"
      />
      <ellipse
        className="paw-bean paw-toe paw-b2"
        cx="52"
        cy="34"
        rx="10"
        ry="14"
        transform="rotate(-6  52 34)"
      />
      <ellipse
        className="paw-bean paw-toe paw-b3"
        cx="76"
        cy="34"
        rx="10"
        ry="14"
        transform="rotate(6   76 34)"
      />
      <ellipse
        className="paw-bean paw-toe paw-b4"
        cx="104"
        cy="52"
        rx="9"
        ry="14"
        transform="rotate(25 104 52)"
      />

      <path
        className="paw-bean paw-pad paw-b5"
        d="M64 56
       C76 56 86 60 81 75
       C83 84 94 82 94 92
       C94 114 74 98 64 98
       C54 98 34 114 34 92
       C34 82 45 84 47 75
       C42 60 52 56 64 56
       Z"
      />
    </svg>
  )
}
