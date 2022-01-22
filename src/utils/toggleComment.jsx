export default function toggleComment(event, visibleCommentSectionsState) {
    Array.prototype.remove = function () {
        let what,
            a = arguments,
            L = a.length,
            ax
        while (L && this.length) {
            what = a[--L]
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1)
            }
        }
        return this
    }

    let element

    if (event.target.tagName.toLowerCase() === 'i' || event.target.tagName.toLowerCase() === 'span') {
        element = event.target.parentNode
    } else {
        element = event.target
    }

    let val = element.id.replace('post_comment_id_', '')
    val = parseInt(val)

    let isVisible = visibleCommentSectionsState.includes(val)

    let newStatus

    if (!isVisible) {
        newStatus = true

        let visibleCommentSections = [...visibleCommentSectionsState]

        // Add item to it
        visibleCommentSections.push(val)

        // Set state
        return visibleCommentSections
    } else {
        newStatus = false

        let visibleCommentSections = [...visibleCommentSectionsState]
        visibleCommentSections.remove(val)

        return visibleCommentSections
    }
}
