import { type } from '@testing-library/user-event/dist/type';
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react'

const HOST_API = "http://localhost:8080/api";

const initialState = {
  list: []
};

const Store = createContext(initialState)

const Form = () => {
  
  const formRef = useRef(null);


  return
  <form ref={formRef}>
    <input type="text" name="name" onChange={(event) => {
      setState({ ...state, name: event.target.value })
    }}></input>
    <input type="text" name="description" onChange={(event) => {
      setState({ ...state, description: event.target.value })
    }}></input>
    <button onClick={onAdd}>Agregar</button>
  </form>
}

const List = () => {
  const { dispatch, state} = useContext(Store);

  useEffect(() => {
    fetch(HOST_API+"/todos")//Promesa
    .then(response => response.json())
    .then((list) => {
      dispatch({type: "update-list", list})
    })
  }, [state.list.length, dispatch]);
  return
  <div>
    <table>
    <thead>
      <tr>
        <td>ID</td>
        <td>Nombre</td>
        <td>¿Está completado?</td>
      </tr>
    </thead>
    <tbody>
      {this.list.map((todo) => {
        return <tr key={todo.id}>
          <td>{todo.id}</td>
          <td>{todo.name}</td>
          <td>{todo.isCompleted}</td>
        </tr>
      })}
    </tbody>
  </table>
  </div>
  
}

//Función puera que siempre recibe la misma entrada
function reducer(state, action) {
  switch (action, type) {
    case 'update-list':
      return { ...state, list: action.list}
    case 'add-item':
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList }
    default:
      return state;  
  }
}

//Sirve para conectar los componentes para conectarlos entre sí
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Store.Provider value= {{ state, dispatch }}>
  </Store.Provider>

}

function App() {
  return 
  <StoreProvider>
    <List />
  </StoreProvider>
}

export default App;
