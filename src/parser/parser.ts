const START_TAG = '<script>';
const END_TAG = '</script>';

const tags = [
    "methods",
    "watch",
    "created",
    "computed"
];

export function parse(sourceCode: string) {
    // Remove imports, "export default" and line breaks
    const code = sourceCode
        .replace("export default", "")
        .replace(/import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g, "")
        .replace(/\r?\n/g, '');
    const startTagIndex: number = code.indexOf(START_TAG);
    const endTagIndex: number = code.indexOf(END_TAG);

    if (startTagIndex >= 0 && endTagIndex >= 0) {
        // Isolate <script> section
        const scriptTag = code
        .substring(startTagIndex + START_TAG.length, endTagIndex)
        .trim()
        .replace(/{\s+/g, "{")
        .replace(/\s+}/g, "}")
        .replace(/,\s+/g, ",")

        .replace(/{(\S+):/g, '{"$1":');

        
        console.log(scriptTag);

        // Remove "export default" and imports
        // const scriptJson = scriptTag
        //     .replace("export default", "")
        //     .split("import.*").join("")
        //     .split("(.*)require(.*)").join("");
        // console.log(scriptJson);
    }
}