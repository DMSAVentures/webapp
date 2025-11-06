/**
 * EmailEditor Component
 * WYSIWYG email editor with rich text editing and variable insertion
 */

import { memo, useRef, useState, useCallback, type HTMLAttributes } from 'react';
import { Button } from '@/proto-design-system/Button/Button';
import { IconOnlyButton } from '@/proto-design-system/Button/IconOnlyButton';
import DropdownMenu from '@/proto-design-system/dropdownmenu/dropdownmenu';
import styles from './component.module.scss';

export interface EmailEditorProps extends HTMLAttributes<HTMLDivElement> {
  /** Initial HTML content */
  initialContent?: string;
  /** Available variables for insertion */
  variables: string[];
  /** Callback when content changes */
  onChange: (html: string) => void;
  /** Additional CSS class name */
  className?: string;
}

type PreviewDevice = 'mobile' | 'desktop';

/**
 * EmailEditor - WYSIWYG editor for email content
 */
export const EmailEditor = memo<EmailEditorProps>(
  function EmailEditor({
    initialContent = '',
    variables,
    onChange,
    className: customClassName,
    ...props
  }) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
    const [content, setContent] = useState(initialContent);
    const [showVariablesMenu, setShowVariablesMenu] = useState(false);
    const variablesMenuRef = useRef<HTMLDivElement>(null);

    const classNames = [
      styles.root,
      customClassName,
    ].filter(Boolean).join(' ');

    // Execute formatting command
    const execCommand = useCallback((command: string, value?: string) => {
      document.execCommand(command, false, value);
      if (editorRef.current) {
        const html = editorRef.current.innerHTML;
        setContent(html);
        onChange(html);
      }
    }, [onChange]);

    // Handle content change
    const handleInput = useCallback(() => {
      if (editorRef.current) {
        const html = editorRef.current.innerHTML;
        setContent(html);
        onChange(html);
      }
    }, [onChange]);

    // Insert variable at cursor position
    const insertVariable = useCallback((variable: string) => {
      const variableTag = `{{${variable}}}`;

      // Insert at cursor position
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const span = document.createElement('span');
        span.className = styles.variable;
        span.textContent = variableTag;
        span.contentEditable = 'false';

        range.insertNode(span);

        // Move cursor after the inserted variable
        range.setStartAfter(span);
        range.setEndAfter(span);
        selection.removeAllRanges();
        selection.addRange(range);

        handleInput();
      }

      setShowVariablesMenu(false);
    }, [handleInput]);

    // Insert link
    const handleInsertLink = useCallback(() => {
      const url = prompt('Enter URL:');
      if (url) {
        execCommand('createLink', url);
      }
    }, [execCommand]);

    // Insert image
    const handleInsertImage = useCallback(() => {
      const url = prompt('Enter image URL:');
      if (url) {
        execCommand('insertImage', url);
      }
    }, [execCommand]);

    // Build variables menu items
    const variableMenuItems = variables.map((variable) => ({
      state: 'default' as const,
      size: 'medium' as const,
      checkbox: false,
      label: variable,
      badge: false,
      shortcut: false,
      toggle: false,
      button: false,
      onClick: () => insertVariable(variable),
    }));

    return (
      <div className={classNames} {...props}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarGroup}>
            <IconOnlyButton
              iconClass="bold"
              variant="secondary"
              size="small"
              ariaLabel="Bold"
              onClick={() => execCommand('bold')}
            />
            <IconOnlyButton
              iconClass="italic"
              variant="secondary"
              size="small"
              ariaLabel="Italic"
              onClick={() => execCommand('italic')}
            />
            <IconOnlyButton
              iconClass="underline"
              variant="secondary"
              size="small"
              ariaLabel="Underline"
              onClick={() => execCommand('underline')}
            />
          </div>

          <div className={styles.toolbarDivider} />

          <div className={styles.toolbarGroup}>
            <IconOnlyButton
              iconClass="link"
              variant="secondary"
              size="small"
              ariaLabel="Insert link"
              onClick={handleInsertLink}
            />
            <IconOnlyButton
              iconClass="image-line"
              variant="secondary"
              size="small"
              ariaLabel="Insert image"
              onClick={handleInsertImage}
            />
          </div>

          <div className={styles.toolbarDivider} />

          <div className={styles.toolbarGroup} ref={variablesMenuRef}>
            <Button
              variant="secondary"
              size="small"
              leftIcon="code-line"
              onClick={() => setShowVariablesMenu(!showVariablesMenu)}
            >
              Insert Variable
            </Button>
            {showVariablesMenu && (
              <div className={styles.variablesMenu}>
                <DropdownMenu items={variableMenuItems} />
              </div>
            )}
          </div>

          <div className={styles.toolbarSpacer} />

          <div className={styles.toolbarGroup}>
            <IconOnlyButton
              iconClass={previewDevice === 'desktop' ? 'computer-line' : 'smartphone-line'}
              variant="secondary"
              size="small"
              ariaLabel={`Switch to ${previewDevice === 'desktop' ? 'mobile' : 'desktop'} preview`}
              onClick={() => setPreviewDevice(previewDevice === 'desktop' ? 'mobile' : 'desktop')}
            />
            <Button
              variant={showPreview ? 'primary' : 'secondary'}
              size="small"
              leftIcon={showPreview ? 'edit-line' : 'eye-line'}
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        {/* Editor / Preview */}
        <div className={styles.editorContainer}>
          {showPreview ? (
            <div
              className={`${styles.preview} ${
                previewDevice === 'mobile' ? styles.previewMobile : styles.previewDesktop
              }`}
            >
              <div
                className={styles.previewContent}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <div
              ref={editorRef}
              className={styles.editor}
              contentEditable
              onInput={handleInput}
              dangerouslySetInnerHTML={{ __html: initialContent }}
              role="textbox"
              aria-label="Email content editor"
              aria-multiline="true"
            />
          )}
        </div>

        {/* Help text */}
        <div className={styles.helpText}>
          <i className="ri-information-line" aria-hidden="true" />
          Use the toolbar to format text, insert links, images, and dynamic variables
        </div>
      </div>
    );
  }
);

EmailEditor.displayName = 'EmailEditor';
