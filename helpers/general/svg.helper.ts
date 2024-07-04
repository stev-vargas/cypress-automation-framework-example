/**
 * Generates the xpath for an SVG icon
 * @param vector Vector value of the svg's path.
 * @returns XPath for svg icon.
 */
export const getSvgPath = (vector: string): string => {
    const svgPath = `*[local-name()='svg']/*[local-name()='path' and @d='${vector}']`;
    return svgPath;
};
