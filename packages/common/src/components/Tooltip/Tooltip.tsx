import React, { Children, ReactElement } from "react"
import styled from "@emotion/styled"
import { usePopperTooltip } from "react-popper-tooltip"
import { COLOR_PALETTE } from "@guythomas.me/common/styles"

const TooltipContainerStyles = styled.div<{ visible?: boolean }>`
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
export const Tooltip: React.FC<TooltipProps> = ({ children, tooltip }) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ trigger: "hover" })

  const childrenCount = Children.count(children)

  if (!children || Children.count(children) !== 1) {
    console.error(`<Tooltip> expects 1 child, found ${childrenCount}`)
  }
  return (
    <>
      {visible && (
        <TooltipContainerStyles
          visible={visible}
          ref={setTooltipRef}
          {...getTooltipProps({ className: "tooltip-container" })}
        >
          {tooltip}
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
        </TooltipContainerStyles>
      )}
      {React.cloneElement(children as ReactElement, { ref: setTriggerRef })}
    </>
  )
}
