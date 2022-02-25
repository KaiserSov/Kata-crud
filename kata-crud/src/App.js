import { type } from '@testing-library/user-event/dist/type';
import React, { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react'

const HOST_API = "http://localhost:8080/api";

const initialState = {
  list: []
};

const Store = createContext(initialState)

const Form = () => {
  const formRef = useRef(null);
  const { dispatch } = useContext(Store);
  const [state, setState] = useState({});

  const onAdd = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: null,
      isCompleted: false
    };

    fetch(HOST_API+"/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((todo) => {
      dispatch({ type: "add-item", item: todo });
      setState({name: ""});
      formRef.current.reset();
    });
  }
  return
  <form ref={formRef}>
    <input type="text" name="name" onChange={(event) => {
      setState({ ...state, name: event.target.value })
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

  const onDelete = (id) => {
    fetch(HOST_API + "/"+id+"/todo",{
      method: "DELETE"
    })
    .then((list) => {
      dispatch({ type: "delete-item", id})
    })
  };

  const onEdit = (todo) => {
    dispatch ({ type: "edit-item", item: todo})
  };

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
          <td><button onClick={() => onDelete(todo.id)}>Eliminar</button></td>
          <td><button onClick={() => onEdit(todo)}>Editar</button></td>
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
    case 'edit-item':
        return { ...state, item: action.list}
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
    <Form />
    <List />
  </StoreProvider>
}

export default App;
