export const slugify = (str) => {
    return str
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z\u0621-\u06CC\u06F0-\u06F9\\-]+/g, "");
};
