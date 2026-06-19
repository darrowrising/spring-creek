import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';

import Editor from '../../components/Editor';

const PREVIEW_DEBOUNCE_MS = 200;

const hasTextContent = (nodes = []) =>
  nodes.some((node) => {
    if (node.text !== undefined) return Boolean(node.text.trim());
    return node.children ? hasTextContent(node.children) : false;
  });

export const hasWebsiteMessage = (editorMessage) => hasTextContent(editorMessage);

function WebsiteMessageEditor({
  initialValue,
  editorMessageRef,
  onPreviewChange,
  showError = false,
  placeholder = 'Enter text...',
}) {
  const [editorMessage, setEditorMessage] = useState(initialValue);
  const onPreviewChangeRef = useRef(onPreviewChange);

  useEffect(() => {
    onPreviewChangeRef.current = onPreviewChange;
  }, [onPreviewChange]);

  useEffect(() => {
    setEditorMessage(initialValue);
    editorMessageRef.current = initialValue;
  }, [initialValue, editorMessageRef]);

  useEffect(() => {
    if (showError) {
      setEditorMessage(editorMessageRef.current);
    }
  }, [showError, editorMessageRef]);

  const debouncedPreviewChange = useMemo(() => {
    let timer;

    const notifyPreview = (content) => {
      clearTimeout(timer);
      timer = setTimeout(() => onPreviewChangeRef.current(content), PREVIEW_DEBOUNCE_MS);
    };

    notifyPreview.cancel = () => clearTimeout(timer);

    return notifyPreview;
  }, []);

  useEffect(() => () => debouncedPreviewChange.cancel(), [debouncedPreviewChange]);

  const handleChange = useCallback(
    (content) => {
      editorMessageRef.current = content;
      debouncedPreviewChange(content);

      if (showError) {
        setEditorMessage(content);
      }
    },
    [debouncedPreviewChange, editorMessageRef, showError]
  );

  return (
    <Editor
      value={editorMessage}
      onChange={handleChange}
      error={showError && !hasTextContent(editorMessage)}
      placeholder={placeholder}
    />
  );
}

WebsiteMessageEditor.propTypes = {
  initialValue: arrayOf(shape({})).isRequired,
  editorMessageRef: shape({ current: arrayOf(shape({})) }),
  onPreviewChange: func.isRequired,
  showError: bool,
  placeholder: string,
};

export default WebsiteMessageEditor;
