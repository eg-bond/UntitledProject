import React from 'react'

const Toolbar = ({ isAuth }) => {
  if (isAuth) {
    return (
      <div>
        <button>Ж</button>
        <button>К</button>
        <button>Ч</button>
        <button>Выделить</button>
        <button>Очистить</button>
      </div>
    )
  }

  return null
}

export default Toolbar
