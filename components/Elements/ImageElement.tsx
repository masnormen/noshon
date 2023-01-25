/* eslint-disable @next/next/no-img-element */
import { Transforms } from 'slate';
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react';
import { ImageElementType } from '../../types/slate';
import UtilButton from '../UtilButton';

const ImageElement = (props: RenderElementProps) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, props.element);

  return (
    <div {...props.attributes} className="group relative flex max-w-lg flex-col">
      {props.children}
      <img alt="image" src={(props.element as ImageElementType).url} />
      <UtilButton
        onClick={() => Transforms.removeNodes(editor, { at: path })}
        className="absolute top-3 left-3 z-50 hidden text-sm group-hover:block"
      >
        🗑️ Delete
      </UtilButton>
    </div>
  );
};

export default ImageElement;