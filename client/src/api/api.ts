import {LoginFormDataType} from "../redux/authReduser";

interface LoginReturnAdditionsType {
    token: string | null,
    message: string | null
}

interface AuthReturnType {
    statusCode: number,
    authData:{
        email: string,
        lastname: string,
        name: string,
        nickname: string,
        userId: string,
    } | null
}

interface LoginReturnType extends AuthReturnType, LoginReturnAdditionsType {}
interface MeReturnType extends AuthReturnType {}


export const authAPI = {
    async login(formData: LoginFormDataType): Promise<LoginReturnType>  {
        const body = JSON.stringify(formData)

        const response = await fetch('/api/auth/login', {method:'POST', body, headers: {'Content-Type': 'application/json'} })
        return response.json()
    },
    async me(token: string): Promise<MeReturnType> {
        const body = JSON.stringify(token)

        const response = await fetch('/api/auth/me', {method:'POST', body, headers: {'Content-Type': 'application/json'}})
        return response.json()
    }
}