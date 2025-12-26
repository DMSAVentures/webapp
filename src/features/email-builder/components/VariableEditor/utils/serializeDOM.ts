/**
 * Serialize DOM content back to a string with {{variable}} syntax
 */

/**
 * Extract the string value from a contentEditable element
 * Converts variable spans back to {{variableName}} syntax
 * @param element - The contentEditable element
 * @returns The serialized string value
 */
export function serializeDOM(element: HTMLElement | null): string {
	if (!element) return "";

	let result = "";

	const processNode = (node: Node): void => {
		if (node.nodeType === Node.TEXT_NODE) {
			// Text node - add content directly
			result += node.textContent || "";
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const el = node as HTMLElement;

			// Check if this is a variable span
			if (el.dataset.variable) {
				result += `{{${el.dataset.variable}}}`;
			} else if (el.tagName === "BR") {
				// Line break
				result += "\n";
			} else if (el.tagName === "DIV" || el.tagName === "P") {
				// Block elements may indicate new lines
				// Only add newline if there's content before
				if (result.length > 0 && !result.endsWith("\n")) {
					result += "\n";
				}
				// Process children
				el.childNodes.forEach(processNode);
			} else {
				// Process children for other elements
				el.childNodes.forEach(processNode);
			}
		}
	};

	element.childNodes.forEach(processNode);

	return result;
}

/**
 * Serialize for single-line input (no newlines)
 */
export function serializeDOMSingleLine(element: HTMLElement | null): string {
	return serializeDOM(element).replace(/\n/g, " ");
}
