

export const authAPI = {
    login(formData) {
        const body = JSON.stringify(formData)
        return fetch('/api/auth/login', {method:'POST', body, headers: {'Content-Type': 'application/json'} }).then(res => {return res.json()})
    },
    me(token) {
        const body = JSON.stringify(token)
        return fetch('/api/auth/me', {method:'POST', body, headers: {'Content-Type': 'application/json'}}).then(res => {return res.json()})
    }
}