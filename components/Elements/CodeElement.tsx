import { RenderElementProps } from 'slate-react';

const CodeElement = (props: RenderElementProps) => {
  return (
    <pre className="rounded bg-gray-100 p-8 font-mono text-sm text-gray-800">
      <code {...props.attributes}>
        {props.children}
      </code>
    </pre>
  );
};

export default CodeElement;