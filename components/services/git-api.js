import 'isomorphic-fetch'

export const status = () => 
    fetch(`/api/git/status`, {
        method: 'POST',
        headers:{'content-type': 'application/json'},
    })

export const commit = () => 
    fetch(`/api/git/commit`, {
        method: 'POST',
        headers:{'content-type': 'application/json'},
    })

export const push = () => 
    fetch(`/api/git/push`, {
        method: 'POST',
        headers:{'content-type': 'application/json'},
    })

