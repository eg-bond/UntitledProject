import {TodoInitialStateType} from "./todoReduser";


let someState = {
    idGenerator: 2,
    todoListObj: [
        {title: 'someName1', id: 'eg_bond_todo1'},
        {title: 'someName2', id: 'eg_bond_todo2'}
    ],
    todoContentObj: {
        eg_bond_todo1: [
            {value: 'bye bread', importance: 'green', orderNum: 0},
            {value: 'bye milk', importance: 'yellow', orderNum: 1},
            {value: 'bye salt', importance: 'red', orderNum: 2}
        ],
        eg_bond_todo2: [
            {value: 'learn JS', importance: 'red', orderNum: 0},
            {value: 'do sports', importance: 'yellow', orderNum: 1},
            {value: 'jerk off', importance: 'red', orderNum: 2}
        ],
    },
    selectedTodo: {
        title: 'someName1',
        content: [
            {value: 'bye bread', importance: 'green', orderNum: 0},
            {value: 'bye milk', importance: 'yellow', orderNum: 1},
            {value: 'bye salt', importance: 'red', orderNum: 2}]
    }
}

