import { useRef, useEffect } from 'react';
import { Editor, Range } from 'slate';
import { useFocused, useSlate, useSlateSelection } from 'slate-react';
import cn from '../lib/cn';
import { useNoshonStore } from '../store/store';
import { CustomElementStrings, CustomMarkupStrings } from '../types/slate';
import ELEMENTS from './Elements';
import FormatButton from './FormatButton';
import MARKUPS from './Markups';

const FormatToolbar = () => {
  const isShowToolbar = useNoshonStore((store) => store.isShowToolbar);
  const setShowToolbar = useNoshonStore((store) => store.setShowToolbar);

  const ref = useRef<HTMLDivElement>(null);
  
  const editor = useSlate();
  const selection = useSlateSelection();
  const isFocused = useFocused();

  useEffect(() => {
    const toolbar = ref.current;

    if (!toolbar) return;

    if (
      !selection ||
      !isFocused ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      setShowToolbar(false);
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection) {
      setShowToolbar(false);
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getClientRects();

    if (rect[0] == null) return;

    toolbar.style.top = `${Math.max(10, rect[0].top + window.pageYOffset - 48)}px`;
    toolbar.style.left = `${Math.max(96, rect[0].left + window.scrollX - 96)}px`;

    setShowToolbar(true);
  }, [editor, selection, isFocused, setShowToolbar]);

  return (
    <aside
      ref={ref}
      className={cn(
        'absolute z-50 flex items-center space-x-1 rounded-lg border border-gray-300 bg-white px-3 py-1 shadow-[0_0_30px_0px_rgba(0,0,0,0.3)] transition-opacity duration-300',
        isShowToolbar ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onMouseDown={(e: any) => {
        e.preventDefault();
      }}
    >
      {/* Markup buttons (bold, italic, etc) */}
      {Object.entries(MARKUPS).map(([name, value]) => {
        return (
          <FormatButton
            key={name}
            symbol={value.symbol}
            markup={name as CustomMarkupStrings}
          />
        );
      })}

      {/* Elements button */}
      {Object.entries(ELEMENTS).filter(([name]) => name !== 'plain').map(([name, value]) => {
        return (
          <FormatButton
            key={name}
            symbol={value.symbol}
            element={name as CustomElementStrings}
          />
        );
      })}
    </aside>
  );
};

export default FormatToolbar;