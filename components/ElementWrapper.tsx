import React from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react';
import UtilButton from './UtilButton';

const ElementWrapper = ({ children, element }: RenderElementProps): JSX.Element => {
  const editor = useSlate();
  
  return (
    <div className="group relative pl-12">
      {children}
      <div className="absolute -left-6 -top-1 inline scale-75 !select-none opacity-0 transition group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100">
        <UtilButton
          contentEditable={false}
          title="Click to add element below"
          onClick={() => {
            const path = ReactEditor.findPath(editor, element);
            Transforms.insertNodes(editor, { type: 'plain', children: [{ text: '' }] }, { at: [path[0] + 1] });
            ReactEditor.focus(editor);
            Transforms.select(editor, { path: [path[0] + 1, 0], offset: 0 });
          }}
          tabIndex={-1}
        ><p className="before:content-[attr(data-content)]" data-content="+"></p></UtilButton>
        <UtilButton
          contentEditable={false}
          title="Click to add element below"
          disabled={Editor.isVoid(editor, element)}
          onClick={() => {
            const path = [...ReactEditor.findPath(editor, element)];
            Transforms.select(editor, {
              anchor: Editor.start(editor, path),
              focus: Editor.end(editor, path),
            });
            ReactEditor.focus(editor);
          }}
          tabIndex={-1}
        ><p className="before:content-[attr(data-content)]" data-content="···"></p></UtilButton>
      </div>
    </div>
  );
};

export default ElementWrapper;