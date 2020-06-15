import React, {EffectCallback, useEffect, useState} from 'react'
import {connect} from "react-redux";
import {compose} from "redux";
import {AppStateType} from "../../redux/store";
import {actions, TodoInitialStateType} from "../../redux/todoReduser";
import {NavLink, useParams, withRouter} from "react-router-dom";



const ToDoPage: React.FC<MapStateToPropsType & MapDispatchToPropsType & WithRouterPropsType> =
    ({todoTitles, selectedTodo, addTodo, deleteTodo, addTodoItem, deleteTodoItem, selectTodo, ...props}) => {

    const [todoTitle, setTodoTitle] = useState('');
    const [todoValue, setTodoValue] = useState('');
    const [editMode, activateEditMode] = useState(false)    ;


    let { todoId } = useParams();
    //@ts-ignore
    const [localTodoContent, setTodoContent] = useState(props.todos[todoId])

    useEffect(() => {
        selectTodo(todoId)
        setTodoTitle(selectedTodo.title)
    }, [todoId, selectedTodo.title])

    return (
        <div>
            <div className="todoPage">

                <div className="leftBar">
                    {todoTitles.map(note => <div key={note.id}>
                        <NavLink to={`/todo/${note.id}`} className="leftBar__item">{note.todoTitle}</NavLink>
                        <button onClick={() => deleteTodo(note.id)}>del</button>
                    </div>)}

                    <button onClick={addTodo} className='leftBar__btn'>Add note</button>
                </div>


                <div className="selectedTodo">
                    <input onBlur={() => props.changeTodoTitle(todoId, todoTitle)} onChange={(e) => setTodoTitle(e.target.value)} value={todoTitle} className='selectedTodo__H'/>
                    {/*<TodoTitleForm title={selectedTodo.title} />*/}
                    <div className="selectedTodo__items">
                        {selectedTodo.content.map(todo =><div key={`${todoId}_${todo.itemId}`} className="selectedTodo__item">
                            {/*<div>*/}
                                {/*{ !editMode &&*/}
                                {/*<div>*/}
                                    {/*<span onDoubleClick={() => activateEditMode(true)}>{todo.value}</span>*/}
                                {/*</div>*/}
                                {/*}*/}
                                {/*{ editMode &&*/}
                                {/*<div>*/}
                                    {/*<input onChange={() => {}} onBlur={() => activateEditMode(false)} value={todo.value}/>*/}
                                {/*</div>*/}
                                {/*}*/}
                            {/*</div>*/}
                            <input onChange={(e) => setTodoValue(e.target.value)} value={todo.value}/>
                            <button onClick={() => deleteTodoItem(todoId, todo.itemId)} className='selectedTodo__btn'>del</button>
                        </div>)}
                        <button onClick={() => addTodoItem(todoId, 'newTodoItem', 'noth')}>Add todo item</button>
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
    todoTitles: TodoInitialStateType['todoTitles'],
    todos: TodoInitialStateType['todos']
    selectedTodo: TodoInitialStateType['selectedTodo'],
}
type MapDispatchToPropsType = {
    addTodo: () => void
    deleteTodo: (todoId: string) => void
    addTodoItem: (noteId: string, value: string, importance: string) => void
    deleteTodoItem: (noteId: string, itemId: number) => void
    selectTodo: (todoId: string) => void
    changeTodoTitle: (noteId: string, title: string) => void
    changeTodoItemContent: (noteId: string, value: string,  itemId: number) => void
}

const mapStateToProps = (state: AppStateType): MapStateToPropsType => ({
    todoTitles: state.todo.todoTitles,
    todos: state.todo.todos,
    selectedTodo: state.todo.selectedTodo
})


export default compose(
    connect<MapStateToPropsType, MapDispatchToPropsType, WithRouterPropsType, AppStateType>(
    mapStateToProps, {addTodo: actions.addTodo, deleteTodo: actions.deleteTodo,
        addTodoItem: actions.addTodoItem, deleteTodoItem: actions.deleteTodoItem, selectTodo: actions.selectTodo,
            changeTodoTitle: actions.changeTodoTitle, changeTodoItemContent: actions.changeTodoItemContent}),
    withRouter,
)(ToDoPage)