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


type ContentItemType = {
    value: string,
    importance: string,
    orderNum: number
}
export type TodoAPIInitialStateType = {
    idGenerator: number,
    todoListArr: Array<{title: string, id: string}>,
    todoContentObj: {
        [key: string]: Array<ContentItemType>
    }
}
export type GetTodoReturnType = {
    statusCode: number,
    message: string | null
    todoData: TodoAPIInitialStateType
}
type todoAPIReturnType = {
    statusCode: number,
    message: string | null
}



export const todoAPI = {
    async syncTodo(todoState: TodoAPIInitialStateType): Promise<todoAPIReturnType>  {
        const token = JSON.parse(localStorage.userData)
        const reqPayload = {...todoState, ...token}
        const body = JSON.stringify(reqPayload)

        //@ts-ignore
        const response = await fetch('/api/todo/sync_todo', {method:'POST', body, headers: {'Content-Type': 'application/json'} })
        return response.json()
    },
    async getTodo(): Promise<GetTodoReturnType> {
        const body = localStorage.userData
        const response = await fetch('/api/todo/get_todo', {method:'POST', body, headers: {'Content-Type': 'application/json'}}) //возможно нужно добавить заголовок, чтобы возвращаемая информация адекватно выводилась
        return response.json()
    }
}