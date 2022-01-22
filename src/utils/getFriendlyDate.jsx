export default function getFriendlyDate(date) {
    let time = Math.round((+new Date() - date) / 1000)

    let minute = 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7

    let friendlyDateString

    if (time < 30) {
        friendlyDateString = 'just now.'
    } else if (time < minute) {
        friendlyDateString = time + ' seconds ago.'
    } else if (time < 2 * minute) {
        friendlyDateString = 'a minute ago.'
    } else if (time < hour) {
        friendlyDateString = Math.floor(time / minute) + ' minutes ago.'
    } else if (Math.floor(time / hour) == 1) {
        friendlyDateString = '1 hour ago.'
    } else if (time < day) {
        friendlyDateString = Math.floor(time / hour) + ' hours ago.'
    } else if (time < day * 2) {
        friendlyDateString = 'yesterday'
    } else {
        friendlyDateString = Math.ceil(time / day) + ' days ago.'
    }

    return friendlyDateString
}
