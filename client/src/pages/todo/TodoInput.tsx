import React, {useState} from 'react'

type InputType = {
    value: string,
    modifyTodoContent: any,
    todoId: string,
    orderNum: number
}

export const TodoInput: React.FC<InputType> = ({value, modifyTodoContent, todoId, orderNum}) => {

    const [insideValue, changeInsideValue] = useState(value)

    return <input type="text"
                   onChange={(e) => changeInsideValue(e.target.value)}
                   value={insideValue}
                   onBlur={() => modifyTodoContent(todoId, insideValue, orderNum)}/>



}