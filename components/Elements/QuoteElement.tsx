import { RenderElementProps } from 'slate-react';

const QuoteElement = (props: RenderElementProps) => {
  return (
    <blockquote className="border-l-4 border-black pl-4" {...props.attributes}>
      {props.children}
    </blockquote>
  );
};

export default QuoteElement;