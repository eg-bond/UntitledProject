let initialState: TodoInitialStateType = {
    idGen: 3,
    todoTitles: [
        {todoTitle: 'someName1', id: 'todo1'},
        {todoTitle: 'someName2', id: 'todo2'}
    ],
    todos: {
        todo1: [
            {value: 'bye bread', importance: 'green', itemId: 0},
            {value: 'bye milk', importance: 'yellow', itemId: 1},
            {value: 'bye salt', importance: 'red', itemId: 2}
        ],
        todo2: [
            {value: 'learn JS', importance: 'red', itemId: 0},
            {value: 'do sports', importance: 'yellow', itemId: 1},
            {value: 'jerk off', importance: 'red', itemId: 2}
        ],
    },
    selectedTodo: {
        title: 'someName1',
        content: [
            {value: 'bye bread', importance: 'green', itemId: 0},
            {value: 'bye milk', importance: 'yellow', itemId: 1},
            {value: 'bye salt', importance: 'red', itemId: 2}]
    }
}
type TodoItemType = {
    value: string,
    importance: string,
    itemId: number
}
type TodoTitlesItemType = {
    todoTitle: string,
    id: string
}

type FullStateType = {
    idGen: number,
    todoTitles: Array<TodoTitlesItemType>,
    todos: {
        [key: string]: Array<TodoItemType>
    },
    selectedTodo: {
        title: string,
        content: Array<TodoItemType>
    }
}


export type TodoInitialStateType = FullStateType