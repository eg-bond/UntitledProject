import { LoginFormDataType } from '../pages/login/AuthPage'

// Auth
type DefServerResponse = {
  statusCode: number
  message: string | null
}

export type AuthDataType = {
  userId: string
  email: string
  name: string
  lastname: string
  nickname: string
}
type AuthResponse = {
  authData: AuthDataType
}

type TokenResponse = {
  token: string | null
}

export const authAPI = {
  async login(
    formData: LoginFormDataType
  ): Promise<DefServerResponse & AuthResponse & TokenResponse> {
    const body = JSON.stringify(formData)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  },
  // Authentification by token when logged
  async me(token: string): Promise<DefServerResponse & AuthResponse> {
    const body = JSON.stringify(token)

    const response = await fetch('/api/auth/me', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  },
}

// Todo
type ContentItemType = {
  value: string
  importance: string
  orderNum: number
}
export type TodoAPIInitialStateType = {
  idGenerator: number
  todoListArr: Array<{ title: string; id: string }>
  todoContentObj: {
    [key: string]: Array<ContentItemType>
  }
}
export type GetTodoReturnTypeAddition = {
  todoData: TodoAPIInitialStateType
}

export const todoAPI = {
  async syncTodo(
    todoState: TodoAPIInitialStateType
  ): Promise<DefServerResponse> {
    const { token } = JSON.parse(localStorage.userData)
    // const reqPayload = { ...todoState, ...token }
    const body = JSON.stringify({ ...todoState, token })

    //@ts-ignore
    const response = await fetch('/api/todo/sync_todo', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  },
  async getTodo(): Promise<DefServerResponse & GetTodoReturnTypeAddition> {
    const body = localStorage.userData
    const response = await fetch('/api/todo/get_todo', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  },
}
