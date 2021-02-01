// Helpers.
import convertToText from './convertToText.jsx'

// Constants.
const f = 'function'
const o = 'object'

/*
  You would call this when a user pastes from
  the clipboard into a `contenteditable` area.
*/
const convertOnPaste = (
    event = {
        preventDefault() {},
    }
) => {
    // Prevent paste.
    event.preventDefault()

    // Set later.
    let value = ''

    // Does method exist?
    const hasEventClipboard = !!(event.clipboardData && typeof event.clipboardData === o && typeof event.clipboardData.getData === f)

    // Get clipboard data?
    if (hasEventClipboard) {
        value = event.clipboardData.getData('text/plain')
    }

    // Insert into temp `<textarea>`, read back out.
    const textarea = document.createElement('textarea')
    textarea.innerHTML = value
    value = textarea.innerText

    // Clean up text.
    value = convertToText(value)

    // Insert text.
    if (typeof document.execCommand === f) {
        document.execCommand('insertText', false, value)
    }
}

// Export.
export default convertOnPaste
