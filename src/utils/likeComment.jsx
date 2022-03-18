export default function likeComment(event) {
    let element
    let hasLiked = false
    let newLikeCount
    let currentLikeCount
    let commentId
    let newLikeText

    if (event.target.tagName.toLowerCase() === 'i' || event.target.tagName.toLowerCase() === 'span') {
        element = event.target.parentNode
    } else {
        element = event.target
    }

    // Has liked
    hasLiked = element.classList.contains('liked')

    // Update counter

    currentLikeCount = element.querySelector('span').innerHTML.substr(0, element.querySelector('span').innerHTML.indexOf(' '))
    currentLikeCount = parseInt(currentLikeCount)

    if (hasLiked) {
        newLikeCount = currentLikeCount - 1
        hasLiked = false
    } else {
        newLikeCount = currentLikeCount + 1
        hasLiked = true
    }

    if (newLikeCount === 1) {
        newLikeText = '1 Like'
    } else {
        newLikeText = newLikeCount + ' Likes'
    }

    // Toggle liked-status
    element.parentNode.style.pointerEvents = 'none' // Set PointerEvents to none to prevent multiple requests

    commentId = element.id.replace('comment_like_id_', '')

    element.querySelector('span').innerHTML = newLikeText

    if (hasLiked) {
        element.classList.add('liked')
    } else {
        element.classList.remove('liked')
    }

    // Request
    let header = new Headers()
    header.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
    header.append('Content-Type', 'application/json')

    const requestOptions = {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
            id: commentId,
        }),
    }

    fetch(process.env.REACT_APP_API_URL + '/api/content/likeComment', requestOptions)
        .then((response) => response.text())
        .then((result) => {
            element.parentNode.style.pointerEvents = 'all'
            return 1
        })
}
