import React, {useEffect, useState} from 'react'
import {connect} from "react-redux";
import {compose} from "redux";
import {AppStateType} from "../../redux/store";
import {
    actions,
    TodoInitialStateType
} from "../../redux/todoReduser";
import {NavLink, useParams, useHistory, withRouter} from "react-router-dom";
import {TodoInput} from "./TodoInput";
import {todoAPI} from "../../api/api";


const ToDoPage: React.FC<MapStateToPropsType & MapDispatchToPropsType & WithRouterPropsType> =
    ({todoListArr, selectedTodo, addTodo, deleteTodo, addTodoContentItem, deleteTodoContentItem, selectTodo, modifyTodoContent, ...props}) => {

        let history = useHistory()
        let {todoId} = useParams()
        const [localTodoTitle, setLocalTodoTitle] = useState('');


        const deleteTodoHandler = (thisTodoId: string) => {

            deleteTodo(thisTodoId)

            if (todoId === thisTodoId) {
                let index = todoListArr.findIndex(item => item.id === thisTodoId)

                let nextTodoUrl = () => index === 0
                    ? history.push(`/todo/${todoListArr[index + 1].id}`)
                    : history.push(`/todo/${todoListArr[index - 1].id}`)

                let emptyTodoUrl = () => history.push(`/todo`)

                todoListArr.length > 1 ? nextTodoUrl() : emptyTodoUrl()
            }
        }


        // why is this working while TodoInput not?
        const CustomInput: React.FC<{value: string, importance: string, orderNum: number}> = (props) => {

            const importanceClass = (imp: string): string => {
                return imp === "red"
                    ? "redImp"
                    : imp === "yellow"
                        ? "yellowImp"
                        : imp === "green"
                            ? "greenImp"
                            : "";
            };

            const [insideValue, changeInsideValue] = useState(props.value)

            return <input className={importanceClass(props.importance)} onChange={(e) => changeInsideValue(e.target.value)} value={insideValue}
                          onKeyDown={(e: any) => e.key === "Enter" && e.target.blur()} onBlur={() => modifyTodoContent(todoId, insideValue, props.importance, props.orderNum)}/>
        }

        useEffect(() => {
            // debugger;
            selectTodo(todoId)
            setLocalTodoTitle(selectedTodo.title)

        }, [todoId, selectedTodo.title])

        type ContentItemType = {
            value: string,
            importance: string,
            orderNum: number
        }
        type BodyType = {
            idGenerator: number,
            todoListArr: Array<{title: string, id: string}>,
            todoContentObj: {
                [key: string]: Array<ContentItemType>
            }
        }

        useEffect(() => {
            console.log('mount')
            return () => {
                let body = {
                    idGenerator: props.idGenerator,
                    todoListArr,
                    todoContentObj: props.todoContentObj
                }
                // todoAPI.syncTodo(body)
            }
        }, [])


        return (
            <div>
                <div className="todoPage">

                    <div className="leftBar">
                        {todoListArr.map(todo => <div key={todo.id}>
                            <NavLink to={`/todo/${todo.id}`} className="leftBar__item">{todo.title}</NavLink>
                            <button onClick={() => deleteTodoHandler(todo.id)}>del</button>
                        </div>)}

                        <button onClick={addTodo} className='leftBar__btn'>Add note</button>
                    </div>

                    <div className="selectedTodo">
                        <input onBlur={() => props.changeTodoTitle(todoId, localTodoTitle)} onKeyDown={(e: any) => e.key === "Enter" && e.target.blur()}
                               onChange={(e) => setLocalTodoTitle(e.target.value)} value={localTodoTitle} className='selectedTodo__H'/>
                        <div className="selectedTodo__items">
                            {selectedTodo.content.map(contentItem=><div key={`${todoId}_${ contentItem.orderNum}`} className="selectedTodo__item">
                                <CustomInput value={contentItem.value} importance={contentItem.importance} orderNum={contentItem.orderNum}/>
                                {/*<TodoInput todoId={todoId} modifyTodoContent={modifyTodoContent} value={contentItem.value} importance={contentItem.importance} orderNum={contentItem.orderNum}/>*/}
                                <button onClick={() => modifyTodoContent(todoId, contentItem.value, "red", contentItem.orderNum)} className='selectedTodo__btn'>red</button>
                                <button onClick={() => modifyTodoContent(todoId, contentItem.value, "yellow", contentItem.orderNum)} className='selectedTodo__btn'>yel</button>
                                <button onClick={() => modifyTodoContent(todoId, contentItem.value, "green", contentItem.orderNum)} className='selectedTodo__btn'>grn</button>
                                <button onClick={() => modifyTodoContent(todoId, contentItem.value, "noth", contentItem.orderNum)} className='selectedTodo__btn'>noth</button>
                                <button onClick={() => deleteTodoContentItem(todoId, contentItem.orderNum)} className='selectedTodo__btn'>del</button>
                            </div>)}
                            <button onClick={() => addTodoContentItem(todoId, '', 'noth')}>Add todo item</button>
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
// type MapStateToPropsType = {
//     todoListArr: todoListArrType;
//     todoContentObj: TodoContentObjType;
//     selectedTodo: SelectedTodoType;
// }
type MapStateToPropsType = {
    idGenerator: number,
    todoListArr: TodoInitialStateType['todoListArr'],
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
    modifyTodoContent: (todoId: string, value: string, importance: string, orderNum: number) => void
}

const mapStateToProps = (state: AppStateType): MapStateToPropsType => ({
    idGenerator: state.todo.idGenerator,
    todoListArr: state.todo.todoListArr,
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
