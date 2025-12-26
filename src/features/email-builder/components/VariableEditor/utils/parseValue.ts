/**
 * Parse a string value into segments of text and variables
 */

export interface TextSegment {
	type: "text";
	content: string;
}

export interface VariableSegment {
	type: "variable";
	name: string;
}

export type Segment = TextSegment | VariableSegment;

/**
 * Parse a string containing {{variable}} patterns into segments
 * @param value - The string to parse (e.g., "Hello {{name}}, welcome!")
 * @returns Array of segments
 */
export function parseValue(value: string): Segment[] {
	const segments: Segment[] = [];
	const regex = /\{\{(\w+)\}\}/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null = null;

	match = regex.exec(value);
	while (match !== null) {
		// Add text before the variable
		if (match.index > lastIndex) {
			segments.push({
				type: "text",
				content: value.slice(lastIndex, match.index),
			});
		}

		// Add the variable
		segments.push({
			type: "variable",
			name: match[1],
		});

		lastIndex = regex.lastIndex;
		match = regex.exec(value);
	}

	// Add remaining text after last variable
	if (lastIndex < value.length) {
		segments.push({
			type: "text",
			content: value.slice(lastIndex),
		});
	}

	return segments;
}
