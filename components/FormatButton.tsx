import { ReactEditor, useSlateStatic } from 'slate-react';

import { isBlockActive, isMarkActive, toggleCurrentBlock, toggleMark } from '../lib/editorHelper';
import cn from '../lib/cn';

import ELEMENTS from './Elements';
import MARKUPS from './Markups';
import UtilButton from './UtilButton';

import { CustomElementStrings, CustomMarkupStrings } from '../types/slate';

type FormatButtonProps = {
  symbol: string | JSX.Element;
  element: CustomElementStrings;
} | {
  symbol: string | JSX.Element;
  markup: CustomMarkupStrings;
};

const FormatButton = (props: FormatButtonProps) => {
  const editor = useSlateStatic();

  if ('element' in props) {
    return (
      <UtilButton
        title={ELEMENTS[props.element].key.join(' + ').toUpperCase()}
        className={cn(
          isBlockActive(editor, props.element) ? 'text-blue-600 font-bold' : '',
          props.element === 'plain' && isBlockActive(editor, 'plain') ? 'pointer-events-none' : ''
        )}
        onMouseDown={(e: any) => {
          e.preventDefault();
          toggleCurrentBlock(editor, props.element);
          ReactEditor.focus(editor);
          
          const afterClick = ELEMENTS[props.element].afterClick;
          if (afterClick) {
            afterClick(editor);
          }
        }}
      >
        {props.symbol}
      </UtilButton>
    );
  }

  return (
    <UtilButton
      title={MARKUPS[props.markup].key.join(' + ').toUpperCase()}
      className={cn(
        isMarkActive(editor, props.markup) ? 'text-blue-600 font-bold' : '',
      )}
      onMouseDown={(e: any) => {
        e.preventDefault();
        toggleMark(editor, props.markup);
        ReactEditor.focus(editor);
      }}
    >
      {props.symbol}
    </UtilButton>
  );


  
};

export default FormatButton;