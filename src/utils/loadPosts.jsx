export default function loadPosts(
    config = {
        filterBy: null, // NULL, 'user', 'group'
        filter: null, // NULL, 'userId', 'groupId'
        page: 1,
    }
) {
    config = {
        filterBy: config.filterBy,
        filter: config.filter,
        page: config.page || 1,
    }

    return new Promise(function (resolve, reject) {
        let postsHeader = new Headers()
        postsHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: postsHeader,
            redirect: 'follow',
        }

        let filterGetParameter = ''

        if (config.filterBy) {
            if (config.filterBy === 'user') {
                filterGetParameter += '&user=' + config.filter
            } else if (config.filterBy === 'group') {
                filterGetParameter += '&group=' + config.filter
            } else if (config.filterBy === 'id') {
                filterGetParameter += '&id=' + config.filter
            } else if (config.filterBy === 'hashtag') {
                filterGetParameter += '&hashtag=' + config.filter
            }
        }

        fetch(process.env.REACT_APP_API_URL + `/api/content/getPosts?page=${config.page + filterGetParameter}`, requestOptions)
            .then((res) => res.json())
            .then(
                (res) => {
                    if (res['status_code'] !== undefined) {
                        if (res['message'] === 'Token has expired') {
                            location.href = '/logout'
                            localStorage.clear()
                        } else {
                            reject(res['message'])
                        }
                    } else {
                        if (res.status == 'not_member') {
                            reject('This group is private. You have to be a member of this group to be able to read posts.')
                        } else {
                            resolve({
                                posts: res.posts,
                                totalPages: res.total_pages,
                                currentPage: res.current_page,
                            })
                        }
                    }
                },
                (error) => {
                    console.error(error)
                    reject('An unknown error occurred. Please try again later.')
                }
            )
    })
}
