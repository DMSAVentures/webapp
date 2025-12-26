/**
 * Selection and cursor utilities for contentEditable
 */

/**
 * Get the current cursor position as a character offset from the start
 */
export function getCursorPosition(element: HTMLElement): number {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return 0;

	const range = selection.getRangeAt(0);
	const preCaretRange = range.cloneRange();
	preCaretRange.selectNodeContents(element);
	preCaretRange.setEnd(range.startContainer, range.startOffset);

	// Count characters, treating variable spans as their {{name}} length
	let position = 0;
	const walker = document.createTreeWalker(
		element,
		NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
		null,
	);

	let node: Node | null = walker.nextNode();
	while (node) {
		if (preCaretRange.comparePoint(node, 0) <= 0) {
			// Node is before or at cursor
			if (node.nodeType === Node.TEXT_NODE) {
				const textNode = node as Text;
				if (preCaretRange.comparePoint(node, textNode.length) < 0) {
					// Cursor is within this text node
					position += range.startOffset;
					break;
				}
				position += textNode.length;
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				const el = node as HTMLElement;
				if (el.dataset.variable) {
					position += `{{${el.dataset.variable}}}`.length;
				}
			}
		}
		node = walker.nextNode();
	}

	return position;
}

/**
 * Set cursor position at the end of an element
 */
export function setCursorAtEnd(element: HTMLElement): void {
	const selection = window.getSelection();
	if (!selection) return;

	const range = document.createRange();
	range.selectNodeContents(element);
	range.collapse(false); // Collapse to end
	selection.removeAllRanges();
	selection.addRange(range);
}

/**
 * Set cursor position after a specific node
 */
export function setCursorAfterNode(node: Node): void {
	const selection = window.getSelection();
	if (!selection) return;

	const range = document.createRange();
	range.setStartAfter(node);
	range.collapse(true);
	selection.removeAllRanges();
	selection.addRange(range);
}

/**
 * Insert a node at the current cursor position
 */
export function insertNodeAtCursor(node: Node): void {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return;

	const range = selection.getRangeAt(0);
	range.deleteContents();
	range.insertNode(node);

	// Move cursor after the inserted node
	setCursorAfterNode(node);
}

/**
 * Get text content before cursor (for @ mention detection)
 */
export function getTextBeforeCursor(element: HTMLElement): string {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return "";

	const range = selection.getRangeAt(0);

	// Create a range from start of element to cursor
	const preCaretRange = document.createRange();
	preCaretRange.selectNodeContents(element);
	preCaretRange.setEnd(range.startContainer, range.startOffset);

	// Get the text content, converting variables to {{name}}
	const tempDiv = document.createElement("div");
	tempDiv.appendChild(preCaretRange.cloneContents());

	let text = "";
	tempDiv.childNodes.forEach((node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			text += node.textContent || "";
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const el = node as HTMLElement;
			if (el.dataset.variable) {
				text += `{{${el.dataset.variable}}}`;
			} else {
				text += el.textContent || "";
			}
		}
	});

	return text;
}

/**
 * Delete content from a position backwards to another position
 * Note: This is a placeholder - complex contentEditable range deletion
 * is handled by the parent component using document.execCommand
 */
export function deleteRange(
	_element: HTMLElement,
	_startOffset: number,
	_endOffset: number,
): void {
	// This is complex with contentEditable - we need to find the actual DOM positions
	// For simplicity, the parent component handles this using document.execCommand
}

/**
 * Check if cursor is at the start of the element
 */
export function isCursorAtStart(element: HTMLElement): boolean {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return false;

	const range = selection.getRangeAt(0);

	// Check if we're at the very beginning
	if (range.startOffset !== 0) return false;

	// Check if the start container is the element itself or its first child
	let node: Node | null = range.startContainer;
	while (node && node !== element) {
		if (node.previousSibling) return false;
		node = node.parentNode;
	}

	return true;
}

/**
 * Check if cursor is at the end of the element
 */
export function isCursorAtEnd(element: HTMLElement): boolean {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return false;

	const range = selection.getRangeAt(0);
	const endContainer = range.endContainer;
	const endOffset = range.endOffset;

	// If in a text node, check if at the end
	if (endContainer.nodeType === Node.TEXT_NODE) {
		if (endOffset !== (endContainer as Text).length) return false;
	}

	// Check if this is the last node
	let node: Node | null = endContainer;
	while (node && node !== element) {
		if (node.nextSibling) return false;
		node = node.parentNode;
	}

	return true;
}
