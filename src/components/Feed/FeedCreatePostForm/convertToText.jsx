const convertToText = (str = '') => {
    // Ensure string.
    let value = String(str)

    // Convert encoding.
    value = value.replace(/&nbsp;/gi, ' ')
    value = value.replace(/&amp;/gi, '&')

    // Replace `<br>`.
    value = value.replace(/<br>/gi, '\n')

    // Replace `<div>` (from Chrome).
    value = value.replace(/<div>/gi, '\n')

    // Replace `<p>` (from IE).
    value = value.replace(/<p>/gi, '\n')

    // Remove extra tags.
    value = value.replace(/<((?!img).*?)>/g, '')

    // Trim each line.
    value = value
        .split('\n')
        .map((line = '') => {
            return line.trim()
        })
        .join('\n')

    // No more than 2x newline, per "paragraph".
    value = value.replace(/\n\n+/g, '\n\n')

    // Clean up spaces.
    value = value.replace(/[ ]+/g, ' ')
    value = value.trim()

    // Expose string.
    return value
}

export default convertToText
