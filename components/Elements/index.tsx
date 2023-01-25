import React from 'react';
import CodeElement from './CodeElement';
import HeadingElement from './HeadingElement';
import QuoteElement from './QuoteElement';
import { DefaultElement, RenderElementProps } from 'slate-react';
import { CustomElementStrings } from '../../types/slate';
import DividerElement from './DividerElement';
import TodoElement from './TodoElement';
import ImageElement from './ImageElement';
import { Editor, Transforms } from 'slate';

/**
 * This file contains all the elements/blocks that can be rendered in the editor.
 */

type ElementMetadata = {
  key: string[];
  symbol: string | JSX.Element;
  // eslint-disable-next-line no-unused-vars
  afterClick?: (editor: Editor) => void;
  // eslint-disable-next-line no-unused-vars
  component: (x: RenderElementProps) => JSX.Element;
};

type ElementMap = Record<CustomElementStrings, ElementMetadata>;

const ELEMENTS: ElementMap = {
  plain: {
    key: ['ctrl', 'k'],
    symbol: '❡',
    component: DefaultElement,
  },
  h1: {
    key: ['ctrl', '1'],
    symbol: 'H1',
    component: (props: RenderElementProps) => <HeadingElement headingSize={1} {...props} />,
  },
  h2: {
    key: ['ctrl', '2'],
    symbol: 'H2',
    component: (props: RenderElementProps) => <HeadingElement headingSize={2} {...props} />,
  },
  h3: {
    key: ['ctrl', '3'],
    symbol: 'H3',
    component: (props: RenderElementProps) => <HeadingElement headingSize={3} {...props} />,
  },
  code: {
    key: ['ctrl', '/'],
    symbol: <span className="font-mono text-sm">&lt;/&gt;</span>,
    component: CodeElement,
  },
  quote: {
    key: ['ctrl', 'q'],
    symbol: '❝',
    component: QuoteElement,
  },
  divider: {
    key: ['ctrl', 'd'],
    symbol: '─',
    afterClick: (editor: Editor) => {
      if (!editor.selection) return;
      const currentSelection = Editor.unhangRange(editor, editor.selection);
      Transforms.select(editor, { path: [currentSelection.anchor.path[0] + 1, 0], offset: 0 });
    },
    component: DividerElement,
  },
  todo: {
    key: ['ctrl', 't'],
    symbol: '☑',
    component: TodoElement,
  },
  image: {
    key: ['ctrl', 'i'],
    symbol: '🖼️',
    component: ImageElement,
  },
};

export default ELEMENTS;
