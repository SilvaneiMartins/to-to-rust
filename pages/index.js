import axios from "axios";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit, MdConfirmationNumber } from "react-icons/md";

const index = () => {

    /** Estados */
    const [todos, setTodos] = useState([]);
    const [editText, setEditText] = useState("");
    const [todosCopy, setTodosCopy] = useState(todos);
    const [editIndex, setEditIndex] = useState(-1);
    const [todosInput, setTodosInput] = useState("");
    const [searchIndex, setSearchIndex] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    /** Gerenciamento de estado */
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");
    const [searchItem, setSearchItem] = useState(search);

    /** Chamada para api */
    useEffect(() => {
        fetchTodos();
    }, [count]);

    /**
     * Função para editar uma tarefa
     */
    const editTodo = (index) => {
        setTodosInput(todos[index].title);
        setEditIndex(index);
    };

    /**
     * Função para buscar todos as tarefas
     */
    const fetchTodos = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8080/todos");
            console.log(response);
            setTodos(response.data);
            setTodosCopy(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * Função para adicionar ou editar uma tarefa
     */
    const addTodo = async () => {
        try {
            if (editIndex === -1) {
                /** Adiciona uma tarefa */
                const response = await axios.post("http://127.0.0.1:8080/todos", {
                    title: todosInput,
                    completed: false,
                });

                setTodos(response.data);
                setTodosCopy(response.data);
                setTodosInput("");
            } else {
                /** Edita uma tarefa */
                const todoToUpdate = { ...todos[editIndex], title: todosInput };

                const response = await axios.put(`http://127.0.0.1:8080/todos/${todoToUpdate.id}`, {
                    todoToUpdate,
                });

                const updatedTodos = [...todos];
                updatedTodos[editIndex] = response.data;
                setTodos(updatedTodos);
                setTodosInput("");
                setEditIndex(-1);
                setCount(count + 1);
            }
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * Função para deletar uma tarefa
     * @param {*} id
     */
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8080/todos/${id}`);
            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * Função para completar uma tarefa
     * @param {*} id
     */
    const toggleCompleted = async (index) => {
        try {
            const todoToUpdate = {
                ...todos[index],
                completed: !todos[index].completed,
            }

            const response = await axios.delete(`http://127.0.0.1:8080/todos/${todoToUpdate.id}`);
            const updatedTodos = [...todos];
            updatedTodos[index] = response.data;
            setTodos(updatedTodos);
            setCount(count + 1);
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * Função para buscar uma tarefa
     */
    const searchTodo = () => {
        const results = todos.filter((todo) =>
            todo.title.toLowerCase().includes(searchInput.toLowerCase())
        );
        setSearchResults(results);
    };

    const formatDate = (dateString) => {
        try {
            const data = new Date(dateString);

            return isNaN(data.getTime())
                ? "Data Inválida"
                : format(data, "dd/MM/yyyy HH:mm:ss", {
                    locale: ptBR,
                });
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * Função para renderizar as tarefas
     * @param {*} todosToRender
     * @returns
     */
    const renderTodos = (todosToRender) => {
        return todosToRender.map((todo, index) => (
            <li key={index} className="li">
                <label htmlFor="" className="form-check-label">
                </label>

                <span className="todo-text">
                    {`${todo.title} ${formatDate(todo.created_at)}`}
                </span>

                <span className="span-button" onClick={() => deleteTodo(todo.id)}>
                    <i className="fa-solid fa-trash">
                        <MdDelete />
                    </i>
                </span>

                <span className="span-button" onClick={() => editIndex(index)}>
                    <i className="fa-solid fa-trash">
                        <MdEdit />
                    </i>
                </span>
            </li>
        ));
    };

    /**
     * Função para pesquisar uma tarefa
     * @param {*} value
     */
    const onHandlerSearch = (value) => {
        const filteredToDo = todos.filter(({ title }) => {
            return title.toLowerCase().includes(value.toLowerCase());
        });

        if (filteredToDo.length > 0) {
            setTodos(todosCopy);
        } else {
            setTodos(filteredToDo);
        }
    };

    /**
     * Função para limpar a pesquisa
     */
    const onClearSearch = () => {
        if (todos.length && todosCopy.length) {
            setTodos(todosCopy);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchItem), 1000);
        return () => clearTimeout(timer);
    }, [searchItem]);

    useEffect(() => {
        if (search) {
            onHandlerSearch(search);
        } else {
            onClearSearch();
        }
    }, [search]);

    return (
        <div className="main-body">
            <div className="todo-app">
                {/* Header */}
                <div className="input-section">
                    {/* Adicionar uma tarefa */}
                    <input
                        type="text"
                        id="todoInput"
                        placeholder="Adicionar uma tarefa"
                        value={todosInput}
                        onChange={(e) => setTodosInput(e.target.value)}
                    />
                    <button onClick={() => addTodo()} className="add">
                        {editIndex === -1 ? "Adicionar" : "Editar"}
                    </button>

                    {/* Pesquisar uma tarefa */}
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Pesquisar"
                        value={searchItem}
                        onChange={(e) => setSearchItem(e.target.value)}
                    />
                    <button onClick={() => {}}>
                        Pesquisar
                    </button>
                </div>

                {/* Body */}
                <div className="todos">
                    <ul className="todo-list">
                        {renderTodos(todos)}
                    </ul>
                    {todos.length === 0 && (
                        <div>
                            <img
                                className="face"
                                src="/rust.png"
                                alt="face"
                            />
                            <h1 className="not-found">
                                Nenhuma tarefa encontrada
                            </h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default index;
