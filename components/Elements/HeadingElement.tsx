import { RenderElementProps } from 'slate-react';

import cn from '../../lib/cn';

const HeadingElement = (props: RenderElementProps & {className?: string, headingSize: 1 | 2 | 3; }) => {
  const CustomTag = `h${props.headingSize}` as 'h1' | 'h2' | 'h3';
  
  return (
    <div
      className={cn(
        'font-bold',
        props.headingSize === 1 && 'text-3xl !mt-6',
        props.headingSize === 2 && 'text-2xl !mt-5',
        props.headingSize === 3 && 'text-xl !mt-4',
        props.className,
      )}
    >
      <CustomTag>{props.children}</CustomTag>
    </div>
  );
};

export default HeadingElement;