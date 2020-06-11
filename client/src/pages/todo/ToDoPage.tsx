import React from 'react'
import {connect} from "react-redux";
import {AppStateType} from "../../redux/store";
import {TodoInitialStateType} from "../../redux/todoReduser";



const ToDoPage: React.FC<mapStateToPropsType> = ({noteTitles, notes}) => {
    return (
        <div>
            <div className="todoPage">

                <div className="leftBar">
                    {noteTitles.map(note => <div key={note.id} className="leftBar__item">{note.noteTitle}</div>)}

                    <button className='leftBar__btn'>Add note</button>
                </div>


                <div className="selectedTodo">
                    <h2 className='selectedTodo__H'>{noteTitles[0].noteTitle}</h2>
                    <div className="selectedTodo__items">
                        {notes.note1.map(note => <div className="selectedTodo__item">{note.value}<button className='selectedTodo__btn'>del</button></div>)}
                    </div>
                </div>

            </div>
        </div>
    )
}


type mapStateToPropsType = {
    noteTitles: TodoInitialStateType['noteTitles'],
    notes: TodoInitialStateType['notes']
}

const mapStateToProps = (state: AppStateType): mapStateToPropsType => ({
    noteTitles: state.todo.noteTitles,
    notes: state.todo.notes
})

export default connect(mapStateToProps)(ToDoPage)