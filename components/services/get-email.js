export const getEmail = async id => {
    const res = await fetch(`http://localhost:3000/api/emails/${id}`)
    const json = await res.json()
    return json    
}

