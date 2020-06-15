import React, {ChangeEvent, Dispatch, useEffect, useState} from 'react'
import {connect} from "react-redux";
import {compose} from "redux";
import {AppStateType} from "../../redux/store";
import {actions, ContentItemType, TodoInitialStateType} from "../../redux/todoReduserNew";
import {NavLink, useParams, withRouter} from "react-router-dom";



const ToDoPageWithLocalContent: React.FC<MapStateToPropsType & MapDispatchToPropsType & WithRouterPropsType> =
    ({todoTitles, selectedTodo, addTodo, deleteTodo, addTodoItem, deleteTodoItem, selectTodo, ...props}) => {


    let { todoId } = useParams();
    //@ts-ignore
    const [localTodoContent, setTodoContent] = useState<Array<ContentItemType>>([]);

    const changeTodoItemValueHandler = (e: ChangeEvent<HTMLInputElement>, todoItem: ContentItemType) => {
        let newLocalContent = localTodoContent.map(oldItem => {
            if (oldItem.itemId === todoItem.itemId) {
                return {...oldItem, value: e.target.value}
            } else {
                return oldItem
            }
        })
        setTodoContent(newLocalContent)
    }


    type ImportanceType = 'red' | 'yellow' | 'green' | 'noth'

    const changeImportance = (imp: ImportanceType, todoItem: ContentItemType) => {
        let newLocalContent = localTodoContent.map(oldItem => {
            if (oldItem.itemId === todoItem.itemId) {
                return {...oldItem, importance: imp}
            } else {
                return oldItem
            }
        })
        setTodoContent(newLocalContent)
        props.changeTodoItemContent(todoId, newLocalContent)
    }
    const importanceClass = (imp: ImportanceType): string => {
        return imp === 'red' ? 'redImp'
            : imp === 'yellow' ? 'yellowImp'
                : imp === 'green' ? 'greenImp'
                    : ''
    }

    const [todoTitle, setTodoTitle] = useState('');


    const changeTodoTitle = (todoId: string | undefined): void => {
        let titleItem = todoTitles.find(titles => titles.id === todoId)
        titleItem ? setTodoTitle(titleItem.todoTitle) : setTodoTitle('')
    }

    // const [focus, changeFocus] = useState(false);

    const addTodoItemLocal = (todoId: string) => {
        setTodoContent([...localTodoContent, {value: '', importance: 'noth', itemId: localTodoContent.length}])
    }

    const deleteTodoItemLocal = (itemId: number) => {
        let content = [...localTodoContent]
        content.splice(itemId, 1)

        for (let i = 0; i <= content.length-1; i++) { //упорядочиваем itemId
            content[i].itemId = i
        }
        setTodoContent([...content])
        props.changeTodoItemContent(todoId, content)
    }

    useEffect(() => {
        changeTodoTitle(todoId)
        //@ts-ignore
        todoId && setTodoContent([...props.todos[todoId]])
    }, [todoId])

        /*@ts-ignore*/
        window.localContent = localTodoContent;

    return (
        <div>
            <div className="todoPage">

                <div className="leftBar">
                    {todoTitles.map(note => <div key={note.id}>
                        <NavLink to={`/todolocal/${note.id}`} className="leftBar__item">{note.todoTitle}</NavLink>
                        <button onClick={() => deleteTodo(note.id)}>del</button>
                    </div>)}

                    <button onClick={addTodo} className='leftBar__btn'>Add note</button>
                </div>


                <div className="selectedTodo">
                    <input onBlur={() => props.changeTodoTitle(todoId, todoTitle)} onChange={(e) => setTodoTitle(e.target.value)} value={todoTitle} className='selectedTodo__H'/>
                    <div className="selectedTodo__items">
                        {localTodoContent &&
                            localTodoContent.map(todo =><div key={`${todoId}_${todo.itemId}`} className="selectedTodo__item">
                            <input className={importanceClass(todo.importance)} onBlur={() => {props.changeTodoItemContent(todoId, localTodoContent)}}
                                   onChange={(e) => changeTodoItemValueHandler(e, todo)} value={todo.value}/>
                            <button onClick={() => changeImportance('red', todo)} className='selectedTodo__btn'>red</button>
                            <button onClick={() => changeImportance('yellow', todo)} className='selectedTodo__btn'>yel</button>
                            <button onClick={() => changeImportance('green', todo)} className='selectedTodo__btn'>grn</button>
                            <button onClick={() => changeImportance('noth', todo)} className='selectedTodo__btn'>noth</button>
                            <button onClick={() => deleteTodoItemLocal(todo.itemId)} className='selectedTodo__btn'>del</button>
                            </div>)
                        }
                        <button onClick={() => addTodoItemLocal(todoId)}>Add todo item</button>
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
    changeTodoItemContent: (noteId: string, content: Array<ContentItemType>) => void
}

const mapStateToProps = (state: AppStateType): MapStateToPropsType => ({
    todoTitles: state.todo_new.todoTitles,
    todos: state.todo_new.todos,
    selectedTodo: state.todo_new.selectedTodo
})


export default compose(
    connect<MapStateToPropsType, MapDispatchToPropsType, WithRouterPropsType, AppStateType>(
    mapStateToProps, {addTodo: actions.addTodo, deleteTodo: actions.deleteTodo,
        addTodoItem: actions.addTodoItem, deleteTodoItem: actions.deleteTodoItem, selectTodo: actions.selectTodo,
            changeTodoTitle: actions.changeTodoTitle, changeTodoItemContent: actions.changeTodoItemContent}),
    withRouter,
)(ToDoPageWithLocalContent)