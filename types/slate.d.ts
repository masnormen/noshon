import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type PlainElementType = {
  type: 'plain';
  children: Descendant[];
};

export type H1ElementType = {
  type: 'h1';
  children: Descendant[];
};

export type H2ElementType = {
  type: 'h2';
  children: Descendant[];
};

export type H3ElementType = {
  type: 'h3';
  children: Descendant[];
};

export type CodeElementType = {
  type: 'code';
  children: Descendant[];
};

export type QuoteElementType = {
  type: 'quote';
  children: Descendant[];
};

export type DividerElementType = {
  type: 'divider';
  children: Descendant[];
};

export type TodoElementType = {
  type: 'todo';
  children: Descendant[];
};

export type ImageElementType = {
  type: 'image';
  url: string;
  children: Descendant[];
};

type CustomElement =
  | H1ElementType
  | H2ElementType
  | H3ElementType
  | CodeElementType
  | QuoteElementType
  | DividerElementType
  | TodoElementType
  | ImageElementType
  | PlainElementType;

export type CustomElementStrings = CustomElement['type'];

export type CustomMarkup = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  codesnippet: boolean;
};

export type CustomMarkupStrings = keyof CustomMarkup;

export type CustomText = Partial<CustomMarkup> & {
  text: string;
  placeholder?: boolean;
};

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module 'slate' {
  // eslint-disable-next-line no-unused-vars
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
  export interface BaseElement {
    type: CustomElementStrings;
  }
}
