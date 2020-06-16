import React, {useEffect, useState, FocusEvent} from 'react'

export const todoInput = ({value, modifyTodoContent, todoId, orderNum}) => {

    const [insideValue, changeInsideValue] = useState(value)

    return (<>
            <input onChange={(e) => changeInsideValue(e.target.value)}
                   value={insideValue}
                   onBlur={() => modifyTodoContent(todoId, insideValue, orderNum)}/>
        </>
    )

}