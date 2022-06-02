import * as React from "react"
import { SVGProps, memo } from "react"

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 256 256"
    {...props}
  >
    <path fill="none" d="M0 0h256v256H0z" />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={16}
      d="m86 110 42 42 42-42M128 40v112M216 152v56a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8v-56"
    />
  </svg>
)

export const DownloadIcon = memo(SvgComponent)
