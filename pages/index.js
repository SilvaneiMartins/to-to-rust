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

    const editTodo = (index) => {
        setTodosInput(todos[index].title);
        setEditIndex(index);
    };

    const fetchTodos = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8080/todos");
            setTodos(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    return <div>index</div>;
};

export default index;
