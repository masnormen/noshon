import { RenderElementProps } from 'slate-react';

const TodoElement = (props: RenderElementProps) => {
  return (
    <div className="mb-4 flex items-center">
      <input {...props.attributes} type="checkbox" {...props.attributes} className="mr-2 h-5 w-5 cursor-pointer accent-blue-300 checked:border-0" />
      {props.children}
    </div>
  );
};

export default TodoElement;