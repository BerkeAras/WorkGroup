import convertToText from './convertToText.jsx'

const convertToMarkup = (str = '') => {
    return convertToText(str).replace(/\n/g, '<br>')
}

export default convertToMarkup
