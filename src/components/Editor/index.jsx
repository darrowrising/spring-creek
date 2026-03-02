import { useCallback, useMemo, useState } from 'react';
import { createEditor, Transforms, Editor as SlateEditor, Element as SlateElement, Text } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import styled from 'styled-components';
import { BoldOutlined, UnorderedListOutlined, OrderedListOutlined, LinkOutlined } from '@ant-design/icons';
import { Input, Popover } from 'antd';
import { arrayOf, bool, func, node, shape, string } from 'prop-types';

// Styled Components
const EditorContainer = styled.div`
  border: 1px solid var(--color-border-1);
  border-radius: 4px;
  background-color: white;

  &.error {
    border-color: var(--color-error);
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid var(--color-border-1);
  background-color: var(--color-white-2);
  flex-wrap: wrap;
  align-items: center;
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border-1);
  background-color: ${(props) => (props.$active ? 'var(--color-white-3)' : 'var(--color-white-1)')};
  border-color: ${(props) => (props.$active ? 'var(--color-blue-6)' : 'var(--color-white-3)')};
  color: ${(props) => (props.$active ? 'var(--color-blue-6)' : 'rgba(0, 0, 0, 0.85)')};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-3);
    border-color: var(--color-blue-6);
    color: var(--color-blue-6);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ColorInput = styled.input`
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-white-3);
  border-radius: 4px;
  cursor: pointer;
  padding: 2px;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 2px;
  }
`;

const EditorContent = styled.div`
  padding: 12px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;

  & > * + * {
    margin-top: 0.5em;
  }

  & > div {
    min-height: 200px;
    &:focus-visible {
      outline: none;
    }
  }
  /* Responsive font size to fix zoom issue on mobile */
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const LinkInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledLinkButton = styled.button`
  padding: 4px 8px;
  background-color: var(--color-blue-6);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #40a9ff;
  }
`;

// Helper functions
const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const isMarkActive = (editor, format) => {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    SlateEditor.removeMark(editor, format);
  } else {
    SlateEditor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: SlateEditor.unhangRange(editor, selection),
      match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    })
  );

  return !!match;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type');
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !SlateEditor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });

  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    let type;
    if (isActive) {
      type = 'paragraph';
    } else if (isList) {
      type = 'list-item';
    } else {
      type = format;
    }
    newProperties = {
      type,
    };
  }

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isLinkActive = (editor) => {
  const [link] = SlateEditor.nodes(editor, {
    match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
  return !!link;
};

const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
};

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && selection.anchor.offset === selection.focus.offset;

  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const addColorToText = (editor, color) => {
  SlateEditor.addMark(editor, 'color', color);
};

// Toolbar Components
const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ToolbarButton
      $active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </ToolbarButton>
  );
};

MarkButton.propTypes = {
  format: string.isRequired,
  icon: shape({}).isRequired,
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ToolbarButton
      $active={isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </ToolbarButton>
  );
};

BlockButton.propTypes = {
  format: string.isRequired,
  icon: shape({}).isRequired,
};

const ColorButton = () => {
  const editor = useSlate();
  const [color, setColor] = useState('#000000');

  return (
    <ColorInput
      type="color"
      value={color}
      onChange={(e) => {
        const newColor = e.target.value;
        setColor(newColor);
        addColorToText(editor, newColor);
      }}
      title="Text Color"
    />
  );
};

const LinkButton = () => {
  const editor = useSlate();
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);

  const handleInsertLink = () => {
    if (url) {
      insertLink(editor, url);
      setUrl('');
      setOpen(false);
    }
  };

  const content = (
    <LinkInputWrapper>
      <Input
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onPressEnter={handleInsertLink}
      />
      <StyledLinkButton onClick={handleInsertLink}>Insert Link</StyledLinkButton>
    </LinkInputWrapper>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottom">
      <ToolbarButton $active={isLinkActive(editor)}>
        <LinkOutlined />
      </ToolbarButton>
    </Popover>
  );
};

// Render Elements
const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };

  switch (element.type) {
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'link':
      return (
        <a {...attributes} href={element.url} style={{ color: 'var(--color-blue-6)', textDecoration: 'underline' }}>
          {children}
        </a>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

Element.propTypes = {
  attributes: shape({}).isRequired,
  children: node.isRequired,
  element: shape({
    type: string,
    align: string,
    url: string,
  }).isRequired,
};

// Render Leaf (for text formatting)
const Leaf = ({ attributes, children, leaf }) => {
  let content = children;

  if (leaf.bold) {
    content = <strong>{content}</strong>;
  }

  if (leaf.color) {
    content = <span style={{ color: leaf.color }}>{content}</span>;
  }

  return <span {...attributes}>{content}</span>;
};

Leaf.propTypes = {
  attributes: shape({}).isRequired,
  children: node.isRequired,
  leaf: shape({
    bold: bool,
    color: string,
  }).isRequired,
};

// Main Editor Component
const Editor = ({ value, onChange, error = false, placeholder = 'Enter text...' }) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Initialize with empty content if no value provided
  const initialValue = value || [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ];

  return (
    <EditorContainer className={error ? 'error' : ''}>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(newValue) => {
          const isAstChange = editor.operations.some((op) => op.type !== 'set_selection');
          if (isAstChange && onChange) {
            onChange(newValue);
          }
        }}
      >
        <Toolbar>
          <MarkButton format="bold" icon={<BoldOutlined />} />
          <ColorButton />
          <LinkButton />
          <BlockButton format="bulleted-list" icon={<UnorderedListOutlined />} />
          <BlockButton format="numbered-list" icon={<OrderedListOutlined />} />
        </Toolbar>
        <EditorContent>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            spellCheck
            autoFocus
          />
        </EditorContent>
      </Slate>
    </EditorContainer>
  );
};

Editor.propTypes = {
  value: arrayOf(shape()),
  onChange: func,
  error: bool,
  placeholder: string,
};

export default Editor;

const serialize = (slateNode) => {
  const { text, bold, color, children, type, url } = slateNode;

  if (Text.isText(slateNode)) {
    let output = text;
    if (bold) {
      output = `<strong>${output}</strong>`;
    }
    if (color) {
      output = `<span style="color: ${color}">${output}</span>`;
    }
    return output;
  }

  const childrenHtml = children.map((n) => serialize(n)).join('');

  switch (type) {
    case 'paragraph':
      return `<p>${childrenHtml}</p>`;
    case 'link':
      return `<a href="${url}">${childrenHtml}</a>`;
    case 'bulleted-list':
      return `<ul>${childrenHtml}</ul>`;
    case 'numbered-list':
      return `<ol>${childrenHtml}</ol>`;
    case 'list-item':
      return `<li>${childrenHtml}</li>`;
    default:
      return childrenHtml;
  }
};

// Helper function to convert Slate value to HTML (for saving to database)
export const slateToHtml = (value) => value.map((slateNode) => serialize(slateNode)).join('');

// Helper function to convert HTML to Slate value (for loading from database)
export const htmlToSlate = (html) => {
  // This is a simple implementation - you may want to use a library like html-to-slate for complex HTML
  if (!html) {
    return [{ type: 'paragraph', children: [{ text: '' }] }];
  }

  // Simple parser - for basic HTML
  const div = document.createElement('div');
  div.innerHTML = html;

  return [{ type: 'paragraph', children: [{ text: div.textContent || '' }] }];
};
