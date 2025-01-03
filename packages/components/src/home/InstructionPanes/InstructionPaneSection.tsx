"use client"
import React from "react"

import Parallax from "~/navigation/Parallax"
import { cn } from "~/shadCnUtil"
import { OverlayHandler } from "../OverlayHandler"

export interface InstructionImageProps {
  sourceProperty: string
}

const InstructionPaneSectionTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("md:mx-20 text-3xl font-bold pb-4", className)}
    {...props}
  />
)
InstructionPaneSectionTitle.displayName = "instruction-pane-section-title"

const InstructionPaneSectionText = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("max-w-[600px] md:mx-20", className)} {...props} />
)
InstructionPaneSectionText.displayName = "instruction-pane-section-text"

const InstructionPaneSectionContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <div className={cn("relative flex flex-col w-full", className)} {...props} />
)
InstructionPaneSectionContent.displayName = "instruction-pane-section-content"

const InstructionPaneSectionImage = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <Parallax className={cn("w-full h-full", className)} {...props} />
)
InstructionPaneSectionImage.displayName = "instruction-pane-section-image"

const InstructionPaneSectionOverlay = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div>
    <Parallax
      className={cn("absolute left-0 top-0 right-0 bottom-0", className)}
      {...props}
    />
    <Parallax className="mix-blend-screen absolute left-0 top-0 right-0 bottom-0 bg-[url('/home/ColorOverlay.png')]" />
  </div>
)
InstructionPaneSectionOverlay.displayName = "instruction-pane-section-overlay"

function InstructionPaneSectionImageBlend(
  props: InstructionImageProps,
): React.ReactElement {
  return (
    <div className={"relative w-full aspect-[1.618] my-8 md:my-12"}>
      <InstructionPaneSectionImage className={props.sourceProperty} />
      <OverlayHandler
        sourceProperty={props.sourceProperty}
        className="absolute left-0 right-0 bottom-0 top-0"
      />
    </div>
  )
}

export {
  InstructionPaneSectionTitle,
  InstructionPaneSectionText,
  InstructionPaneSectionContent,
  InstructionPaneSectionOverlay,
  InstructionPaneSectionImageBlend,
}
