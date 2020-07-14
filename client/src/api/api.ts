import {LoginFormDataType} from "../pages/login/AuthPage";

interface DefaultReturnType {
    statusCode: number,
    message: string | null
}

export interface AuthDataType {
    userId: string,
    email: string,
    name: string,
    lastname: string,
    nickname: string
}
interface AuthAPIReturnTypeAddition {
    authData: AuthDataType
}

interface LoginReturnAddition {
    token: string | null
}

export const authAPI = {
    async login(formData: LoginFormDataType): Promise<DefaultReturnType & AuthAPIReturnTypeAddition & LoginReturnAddition>  {
        const body = JSON.stringify(formData)

        const response = await fetch('/api/auth/login', {method:'POST', body, headers: {'Content-Type': 'application/json'} })
        return response.json()
    },
    async me(token: string): Promise<DefaultReturnType & AuthAPIReturnTypeAddition> {
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
export type GetTodoReturnTypeAddition = {
    todoData: TodoAPIInitialStateType
}


export const todoAPI = {
    async syncTodo(todoState: TodoAPIInitialStateType): Promise<DefaultReturnType>  {
        const token = JSON.parse(localStorage.userData)
        const reqPayload = {...todoState, ...token}
        const body = JSON.stringify(reqPayload)

        //@ts-ignore
        const response = await fetch('/api/todo/sync_todo', {method:'POST', body, headers: {'Content-Type': 'application/json'}})
        return response.json()
    },
    async getTodo(): Promise<DefaultReturnType & GetTodoReturnTypeAddition> {
        const body = localStorage.userData
        const response = await fetch('/api/todo/get_todo', {method:'POST', body, headers: {'Content-Type': 'application/json'}})
        return response.json()
    }
}