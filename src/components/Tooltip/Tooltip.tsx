import React from "react"
import styled from "@emotion/styled"
import TooltipTrigger from "react-popper-tooltip"
import { COLOR_PALETTE } from "~styles"

const TooltipContainerStyles = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background-color: ${() => COLOR_PALETTE.backgroundTertiary.color};
  @media print {
    display: none;
  }
`
interface TooltipProps {
  children: React.ReactNode
  tooltip: string
}
export const Tooltip: React.FC<TooltipProps> = ({ children, tooltip }) => (
  <TooltipTrigger
    placement="bottom"
    tooltip={({
      arrowRef,
      tooltipRef,
      getArrowProps,
      getTooltipProps,
      placement,
    }) => (
      <TooltipContainerStyles
        {...getTooltipProps({
          ref: tooltipRef,
          className: "tooltip-container",
        })}
      >
        <div
          {...getArrowProps({
            ref: arrowRef,
            className: "tooltip-arrow",
            "data-placement": placement,
          })}
        />
        {tooltip}
      </TooltipContainerStyles>
    )}
  >
    {({ getTriggerProps, triggerRef }) => (
      <span
        {...getTriggerProps({
          ref: triggerRef,
          className: "trigger",
        })}
      >
        {children}
      </span>
    )}
  </TooltipTrigger>
)
