import React, {useEffect, useState, FocusEvent} from 'react'
import {connect} from "react-redux";
import {compose} from "redux";
import {AppStateType} from "../../redux/store";
import {actions, TodoInitialStateType} from "../../redux/todoReduser";
import {NavLink, useParams, withRouter} from "react-router-dom";
import {TodoInput} from './TodoInput';


const ToDoPage: React.FC<MapStateToPropsType & MapDispatchToPropsType & WithRouterPropsType> =
    ({todoListObj, selectedTodo, addTodo, deleteTodo, addTodoContentItem, deleteTodoContentItem, selectTodo, modifyTodoContent, ...props}) => {

        let { todoId } = useParams();

        const [localTodoTitle, setLocalTodoTitle] = useState('');


        // why is this working while TodoInput not?
        const CustomInput: React.FC<{value: string, orderNum: number}> = (props) => {
            const [insideValue, changeInsideValue] = useState(props.value)

            return <input onChange={(e) => changeInsideValue(e.target.value)} value={insideValue}
                          onBlur={() => modifyTodoContent(todoId, insideValue, props.orderNum)}/>
        }

        useEffect(() => {
            // debugger;
            selectTodo(todoId)
            setLocalTodoTitle(selectedTodo.title)
        }, [todoId, selectedTodo.title])


        return (
            <div>
                <div className="todoPage">

                    <div className="leftBar">
                        {todoListObj.map(todo => <div key={todo.id}>
                            <NavLink to={`/todo/${todo.id}`} className="leftBar__item">{todo.title}</NavLink>
                            <button onClick={() => deleteTodo(todo.id)}>del</button>
                        </div>)}

                        <button onClick={addTodo} className='leftBar__btn'>Add note</button>
                    </div>


                    <div className="selectedTodo">
                        <input onBlur={() => props.changeTodoTitle(todoId, localTodoTitle)} onChange={(e) => setLocalTodoTitle(e.target.value)}
                               value={localTodoTitle} className='selectedTodo__H'/>
                        <div className="selectedTodo__items">
                            {selectedTodo.content.map(contentItem=><div key={`${todoId}_${ contentItem.orderNum}`} className="selectedTodo__item">
                                <CustomInput value={contentItem.value} orderNum={contentItem.orderNum}/>
                                <button onClick={() => deleteTodoContentItem(todoId, contentItem.orderNum)} className='selectedTodo__btn'>del</button>
                            </div>)}
                            <button onClick={() => addTodoContentItem(todoId, 'newTodoItem', 'noth')}>Add todo item</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

type WithRouterPropsType = {
    match: any,
    history: Array<string>
}
type MapStateToPropsType = {
    todoListObj: TodoInitialStateType['todoListObj'],
    todoContentObj: TodoInitialStateType['todoContentObj']
    selectedTodo: TodoInitialStateType['selectedTodo'],
}
type MapDispatchToPropsType = {
    addTodo: () => void
    deleteTodo: (todoId: string) => void
    addTodoContentItem: (todoId: string, value: string, importance: string) => void
    deleteTodoContentItem: (todoId: string, orderNum: number) => void
    selectTodo: (todoId: string) => void
    changeTodoTitle: (todoId: string, title: string) => void
    modifyTodoContent: (todoId: string, value: string,  orderNum: number) => void
}

const mapStateToProps = (state: AppStateType): MapStateToPropsType => ({
    todoListObj: state.todo.todoListObj,
    todoContentObj: state.todo.todoContentObj,
    selectedTodo: state.todo.selectedTodo
})


export default compose(
    connect<MapStateToPropsType, MapDispatchToPropsType, WithRouterPropsType, AppStateType>(
        mapStateToProps, {addTodo: actions.addTodo, deleteTodo: actions.deleteTodo,
            addTodoContentItem: actions.addTodoContentItem, deleteTodoContentItem: actions.deleteTodoContentItem, selectTodo: actions.selectTodo,
            changeTodoTitle: actions.changeTodoTitle, modifyTodoContent: actions.modifyTodoContent }),
    withRouter,
)(ToDoPage)
