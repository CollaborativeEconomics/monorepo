'use client';
import React from 'react';

import Image from 'next/image';
import { cn } from '~/shadCnUtil';
import { OverlayHandler } from './OverlayHandler';

export interface InstructionImageProps {
  source: string;
  className?: string;
}

function InstructionPaneSectionImageBlend(
  props: InstructionImageProps,
): React.ReactElement {
  return (
    <div className={cn('relative w-full h-full', props.className)}>
      <Image
        src={props.source}
        alt="Instruction Pane Section Image"
        fill
        className="object-cover object-top md:object-top-left"
      />
      <OverlayHandler
        source={props.source}
        className="absolute left-0 right-0 bottom-0 top-0"
      />
    </div>
  );
}

export { InstructionPaneSectionImageBlend };
