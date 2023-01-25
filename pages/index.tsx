import { KeyboardEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { createEditor, Descendant, Editor, Range, Transforms } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps, DefaultLeaf, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';

import { isBlockActive, toggleCurrentBlock, toggleMark } from '../lib/editorHelper';
import { withImages } from '../lib/withImages';

import ELEMENTS from '../components/Elements';
import MARKUPS from '../components/Markups';

import UtilButton from '../components/UtilButton';
import ElementWrapper from '../components/ElementWrapper';
import FormatToolbar from '../components/FormatToolbar';

import { CustomElement, CustomElementStrings, CustomMarkupStrings } from '../types/slate';

const Home = () => {
  const [title, setTitle] = useState<string>('Noshon');
  const titleRef = useRef<HTMLInputElement>(null);

  const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), []);

  const handleKeyDown = (event: KeyboardEvent) => {
    // Handle arrow up and arrow left and focus to title
    if (
      (event.key === 'ArrowUp' || event.key === 'ArrowLeft') &&
      editor.selection?.anchor.path[0] === 0 &&
      editor.selection?.anchor.offset === 0
    ) {
      event.preventDefault();
      titleRef.current?.focus();
      return;
    }

    // Handle Ctrl keys
    if (event.ctrlKey) {
      // Match key combination for elements
      let match = Object.entries(ELEMENTS).find(([, { key }]) => key[0] === 'ctrl' && key[1] === event.key);
      if (match) {
        event.preventDefault();
        toggleCurrentBlock(editor, match[0] as CustomElementStrings);
        return;
      }

      // Match key combination for markups
      let match_m = Object.entries(MARKUPS).find(([, { key }]) => key[0] === 'ctrl' && key[1] === event.key);
      if (match_m) {
        event.preventDefault();
        toggleMark(editor, match_m[0] as CustomMarkupStrings);
        return;
      }
    }

    // Handle soft line breaks (So Shift + Enter won't create new paragraph)
    if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      Transforms.insertText(editor, '\n');
    }
  };

  const renderElement = useCallback((props: RenderElementProps) => {
    const Element =
      props.element.type === undefined ? ELEMENTS['plain'].component : ELEMENTS[props.element.type].component;

    return (
      <ElementWrapper {...props}>
        <Element {...props} />
      </ElementWrapper>
    );
  }, []);

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => {
      if (props.leaf.placeholder && isBlockActive(editor, 'plain')) {
        return (
          <>
            <span className="pointer-events-none absolute top-0 bg-transparent opacity-30" contentEditable={false}>
              Type &apos;/&apos; for commands
            </span>
            <DefaultLeaf {...props} />
          </>
        );
      }

      return (
        <span
          className={Object.entries(MARKUPS)
            .map(([name, value]) => {
              if (props.leaf[name as CustomMarkupStrings]) {
                return value.className;
              }
            })
            .join(' ')}
          {...props.attributes}
        >
          {props.children}
        </span>
      );
    },
    [editor]
  );

  const [val, setVal] = useState<string>('');

  useEffect(() => {
    const [match] = Array.from(Editor.nodes(editor, { mode: 'all', match: () => true }));
    setVal(JSON.stringify((match?.[0] as CustomElement)?.children));
  }, [title, editor]);

  return (
    <>
      <Head>
        <title>Noshon - The all-in-one rich-text editor</title>
        <meta
          name="description"
          content="The all-in-one rich-text editor which tries to replicate some feature of Notion."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/api/og" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Noshon - The all-in-one rich-text editor" />
        <meta
          name="twitter:description"
          content="The all-in-one rich-text editor which tries to replicate some feature of Notion."
        />
        <meta name="twitter:image" content="/api/og" />
      </Head>

      {/* Top Navigation */}
      <nav className="flex items-center space-x-4 bg-white px-3 py-1">
        <div className="space-x-2">
          <UtilButton>&lt;</UtilButton>
          <UtilButton>&gt;</UtilButton>
        </div>
        <div className="flex-1 space-x-2">
          <UtilButton>🏠 Home</UtilButton>
          <span className="text-gray-400">/</span>
          <UtilButton>{title ? title : 'Untitled'}</UtilButton>
        </div>
        <div>
          <UtilButton>Share the ❤️</UtilButton>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col items-center bg-white py-8 px-4 md:py-12 md:px-16">
        {/* Editor */}
        <article className="flex w-full flex-col">
          {/* Title */}
          <input
            className="h-full w-full translate-x-12 space-y-4 pl-12 pt-8 text-4xl font-bold outline-none placeholder:text-gray-300 md:px-8"
            placeholder="Untitled"
            ref={titleRef}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              // Handle enter, arrow down, and arrow right and focus to editor
              if (
                event.key === 'Enter' ||
                event.key === 'ArrowDown' ||
                (event.key === 'ArrowRight' && titleRef.current?.selectionEnd === title.length)
              ) {
                event.preventDefault();
                ReactEditor.focus(editor);
              }
            }}
          />

          {/* Body */}
          <Slate editor={editor} value={initialValue}>
            <FormatToolbar />
            <Editable
              autoFocus
              className="h-full w-full space-y-3 py-8 px-2 md:p-8"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={handleKeyDown as unknown as KeyboardEventHandler<HTMLDivElement>}
              decorate={([node, path]) => {
                if (editor.selection != null) {
                  if (
                    !Editor.isEditor(node) &&
                    Editor.string(editor, [path[0]]) === '' &&
                    Range.includes(editor.selection, path) &&
                    Range.isCollapsed(editor.selection)
                  ) {
                    return [
                      {
                        ...editor.selection,
                        placeholder: true,
                      },
                    ];
                  }
                }
                return [];
              }}
            />
          </Slate>
        </article>

        <div className="h-full w-full space-y-4 p-8 text-center">
          <pre className="font-bold">{JSON.stringify(val, null, 2)}</pre>
        </div>
      </main>
    </>
  );
};

const initialValue: Descendant[] = [
  { type: 'quote', children: [{ text: 'The all-in-one rich-text editor 🚀' }] },
  {
    type: 'plain',
    children: [
      {
        text: 'In this project, I tried to replicate some feature that is available in Notion, an amazing productivity and note-taking app.This page will give you a showcase of how you can use this rich text editor.',
      },
    ],
  },
  { type: 'h2', children: [{ text: 'Features' }] },
  {
    type: 'todo',
    children: [
      { text: '✍️ Basic markups (' },
      { text: 'bold', bold: true },
      { text: ', ' },
      { italic: true, text: 'italic' },
      { text: ', ' },
      { text: 'underline', underline: true },
      { text: ', ' },
      { text: 'strikethrough', strikethrough: true },
      { text: ', ' },
      { text: 'code snippet', codesnippet: true },
      { text: ')' },
    ],
  },
  {
    type: 'todo',
    children: [{ text: '📄 Basic blocks (heading blocks, code blocks, quote, todos, divider)' }],
  },
  {
    type: 'todo',
    children: [
      {
        text: '🖼️ Image support (insert image by pasting the source URL 🔗 or drag them to the editor )',
      },
    ],
  },
  {
    type: 'todo',
    children: [{ text: '🖌️ Floating toolbar (highlight a text or click the "..." button on the side)' }],
  },
  {
    type: 'todo',
    children: [
      {
        text: '⌨️ Keyboard shortcuts (hover on the buttons on floating toolbar to discover the shortcuts)',
      },
    ],
  },
  { children: [{ text: 'Tech Stack' }], type: 'h2' },
  {
    type: 'image',
    url: 'https://res.cloudinary.com/practicaldev/image/fetch/s--JHCnUuat--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/adcvmgs9lja0i6f1u1p3.jpg',
    children: [{ text: '' }],
  },
  {
    type: 'plain',
    children: [
      {
        text: "This project is proudly built in TypeScript using Next.js, Tailwind CSS, Zustand, and a bunch of Slate.js (it's an amazing customizable framework for building rich text editors, check it out 🙌)",
      },
    ],
  },
  { type: 'h2', children: [{ text: 'About' }] },
  { type: 'plain', children: [{ text: 'Created by Nourman Hajar (masnormen)' }] },
  { type: 'plain', children: [{ text: 'https://nourman.id/' }] },
  { type: 'plain', children: [{ text: 'https://github.com/masnormen' }] },
  { children: [{ text: 'd' }], type: 'divider' },
  { children: [{ text: "Enough talking, let's see it in action!" }], type: 'h3' },
  {
    type: 'plain',
    children: [
      { text: 'Try highlighting this text, click the "H1" button or press the key combination ' },
      { text: 'Ctrl + 1', codesnippet: true },
      { text: '. For keyboard shortcuts, hover the buttons above! Also, try highlighting some text and press ' },
      { text: 'Ctrl + B.', codesnippet: true },
    ],
  },
  {
    type: 'plain',
    children: [
      { text: 'Pressing ' },
      { text: 'Enter', codesnippet: true },
      { text: ' will create a new block.\nTry ' },
      { text: 'Shift + Enter', codesnippet: true },
      { text: ' to add a new line in the same block!' },
    ],
  },
  {
    type: 'plain',
    children: [
      { text: 'You can also add ' },
      { text: 'console.log("a code here!")', codesnippet: true },
      { text: '. Wow.' },
    ],
  },
  { type: 'h3', children: [{ text: 'A sample code block:' }] },
  { type: 'code', children: [{ text: 'console.log("Noshon 🫶")' }] },
  { type: 'plain', children: [{ text: '' }] },
];

export default Home;
