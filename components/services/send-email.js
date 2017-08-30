export const sendEmail = async emailId => fetch(`/api/emails/${emailId}/send`, {
    method: "POST",
    headers:{'content-type': 'application/json'},
})
