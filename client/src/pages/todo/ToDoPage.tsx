import React, {EffectCallback, useEffect} from 'react'
import {connect} from "react-redux";
import {compose} from "redux";
import {AppStateType} from "../../redux/store";
import {actions, TodoInitialStateType} from "../../redux/todoReduser";
import {NavLink, useParams, withRouter} from "react-router-dom";



const ToDoPage: React.FC<MapStateToPropsType & MapDispatchToPropsType & WithRouterPropsType> =
    ({todoTitles, selectedTodo, addTodo, deleteTodo, addTodoItem, deleteTodoItem, selectTodo, ...props}) => {

    let { todoId } = useParams();

    useEffect(() => {
        selectTodo(todoId)
    }, [todoId])

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
                    <h2 className='selectedTodo__H'>{selectedTodo.title}</h2>
                    <div className="selectedTodo__items">
                        {selectedTodo.content.map(todo =><div key={`${todoId}_${todo.itemId}`} className="selectedTodo__item">
                            {todo.value}
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
    selectedTodo: TodoInitialStateType['selectedTodo']
}
type MapDispatchToPropsType = {
    addTodo: () => void
    deleteTodo: (todoId: string) => void
    addTodoItem: (noteId: string, value: string, importance: string) => void
    deleteTodoItem: (noteId: string, itemId: number) => void
    selectTodo: (todoId: string) => void
}

const mapStateToProps = (state: AppStateType): MapStateToPropsType => ({
    todoTitles: state.todo.todoTitles,
    selectedTodo: state.todo.selectedTodo
})


export default compose(
    connect<MapStateToPropsType, MapDispatchToPropsType, WithRouterPropsType, AppStateType>(
    mapStateToProps, {addTodo: actions.addTodo, deleteTodo: actions.deleteTodo,
        addTodoItem: actions.addTodoItem, deleteTodoItem: actions.deleteTodoItem, selectTodo: actions.selectTodo}),
    withRouter,
)(ToDoPage)