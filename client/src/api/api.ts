import { LoginFormDataType } from '../pages/login/AuthPage'
import { TodoInitialStateT } from '../redux/todoReduser'

export type DefResponseT = {
  statusCode: number
  message: string | null
}

// Auth
export type DB_AuthDataT = {
  email: string
  name: string
  lastname: string
  nickname: string
}

export const authAPI = {
  //Sign in with email and pass
  async login(
    formData: LoginFormDataType
  ): Promise<DefResponseT & { authData: DB_AuthDataT } & { token: string }> {
    const body = JSON.stringify(formData)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  },
  // Authentification by token when logged
  async me(token: string): Promise<DefResponseT & { authData: DB_AuthDataT }> {
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
export type DB_TodoDataT = Omit<
  TodoInitialStateT,
  'currentTodoId' | 'selectedContentItem'
> & { lastUpdate: number }

export const todoAPI = {
  async syncTodo(): Promise<DefResponseT> {
    const LStodoData: DB_TodoDataT = JSON.parse(localStorage.todoData)
    const { token }: { token: string } = JSON.parse(localStorage.userData)
    const body = JSON.stringify({ ...LStodoData, token })

    const response = await fetch('/api/todo/sync_todo', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  },

  async getTodo(): Promise<DefResponseT & { todoData: DB_TodoDataT }> {
    const body = localStorage.userData
    console.log('gettingTodo')
    const response = await fetch('/api/todo/get_todo', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  },
}
