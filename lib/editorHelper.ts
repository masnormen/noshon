import { Editor, Transforms, Text } from 'slate';
import { CustomElementStrings, CustomMarkupStrings } from '../types/slate';

/* Block Helpers */

export const isBlockActive = (editor: Editor, type: CustomElementStrings) => {
  if (!editor.selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, editor.selection),
      match: (n) => Editor.isBlock(editor, n) && n.type === type,
    })
  );
  return !!match;
};

export const toggleCurrentBlock = (editor: Editor, type: CustomElementStrings) => {
  Transforms.setNodes(
    editor,
    { type: isBlockActive(editor, type) ? undefined : type },
    { match: (n) => Editor.isBlock(editor, n) }
  );
};

/* Markup Helpers */

export const isMarkActive = (editor: Editor, type: CustomMarkupStrings) => {
  const marks = Editor.marks(editor);
  return marks ? marks[type] === true : false;
};

export const toggleMark = (editor: Editor, type: CustomMarkupStrings) => {
  Transforms.setNodes(
    editor,
    { [type]: isMarkActive(editor, type) ? false : true },
    { match: (n) => Text.isText(n), split: true }
  );
};
