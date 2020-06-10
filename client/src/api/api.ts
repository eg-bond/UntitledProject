import {LoginFormDataType} from "../pages/login/AuthPage";


interface LoginReturnAdditions {
    token: string | null,
    message: string | null
}

export interface AuthDataType {
    userId: string,
    email: string,
    name: string,
    lastname: string,
    nickname: string
}

interface AuthAPIReturnType {
    statusCode: number,
    authData: AuthDataType
}

export const authAPI = {
    async login(formData: LoginFormDataType): Promise<AuthAPIReturnType & LoginReturnAdditions>  {
        const body = JSON.stringify(formData)

        const response = await fetch('/api/auth/login', {method:'POST', body, headers: {'Content-Type': 'application/json'} })
        return response.json()
    },
    async me(token: string): Promise<AuthAPIReturnType> {
        const body = JSON.stringify(token)

        const response = await fetch('/api/auth/me', {method:'POST', body, headers: {'Content-Type': 'application/json'}})
        return response.json()
    }
}