export const saveEmail = (emailId, changedSource) => fetch(`/api/emails/${emailId}/save`, {
    method: "POST",
    headers:{'content-type': 'application/json'},
    body: JSON.stringify({
        emailSource: changedSource
    })
})
