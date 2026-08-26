import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

interface TodoItem {
    id: string;
    name: string;
    done: boolean;
    deleted: boolean;
}

const Todo = () => {
    const { userid } = useParams();
    const navigate = useNavigate();
    const [todos, setTodos] = useState<TodoItem[] | null>(null);
    const [newTodo, setNewTodo] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const getTodos = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            const response = await axios.get(`${API_BASE_URL}/todo`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const todosAvailableData = response.data.todos;
            if (todosAvailableData && todosAvailableData.length > 0) {
                const availableTodos: TodoItem[] = [];
                todosAvailableData.forEach((todoData: any) => {
                    if (!todoData.deleted) {
                        availableTodos.push({
                            id: todoData.id,
                            name: todoData.name,
                            done: todoData.done,
                            deleted: todoData.deleted,
                        });
                    }
                });
                setTodos(availableTodos);
            } else {
                setTodos([]);
            }
        } catch (error) {
            console.error("Failed to fetch todos:", error);
            setTodos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTodos();
    }, [userid]);

    const createTodoHandler = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newTodo.trim()) {
            return;
        }
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}/add`, {
                "name": newTodo.trim()
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            setNewTodo("");
            await getTodos();
        } catch (error) {
            console.error("Failed to create todo:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const markAsDone = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}/update`, {
                id: id
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            await getTodos();
        } catch (error) {
            console.error("Failed to mark todo as done:", error);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE_URL}/delete`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                data: {
                    id: id
                }
            });
            await getTodos();
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const visibleTodos = todos ? todos.filter(todo => !todo.deleted) : null;
    const completedCount = visibleTodos ? visibleTodos.filter(t => t.done).length : 0;

    return (
        <div className="min-h-screen bg-[#F7F1DE] text-[#4E220F] flex flex-col items-center py-10 px-4 sm:px-6">
            {/* Decorative Blur Accent */}
            <div className="fixed top-12 left-1/2 -translate-x-1/2 w-[450px] h-[250px] bg-[#B0BA99] rounded-full blur-[100px] opacity-60 pointer-events-none" />

            <div className="relative w-full max-w-2xl">
                {/* Top Header */}
                <div className="flex items-center justify-between mb-8 bg-white/90 border border-[#B0BA99] backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg shadow-[#9D6638]/10">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-[#9D6638] animate-pulse" />
                            <h1 className="text-xl sm:text-2xl font-bold text-[#4E220F] tracking-tight">
                                My Tasks
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-[#4E220F]/70 mt-1">
                            {visibleTodos ? `${completedCount} of ${visibleTodos.length} tasks completed` : "Loading tasks..."}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#4E220F] bg-[#B0BA99] hover:bg-[#a0ab88] border border-[#9D6638]/20 rounded-xl transition-all duration-200 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>

                {/* Create Todo Form */}
                <form onSubmit={createTodoHandler} className="mb-6">
                    <div className="flex gap-2 bg-white border border-[#B0BA99] rounded-2xl p-2 shadow-md shadow-[#9D6638]/5 focus-within:border-[#9D6638] focus-within:ring-2 focus-within:ring-[#9D6638]/30 transition-all duration-200">
                        <input
                            type="text"
                            placeholder="Add a new task..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            className="flex-1 bg-transparent px-3 py-2 text-sm text-[#4E220F] placeholder-[#4E220F]/40 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={submitting || !newTodo.trim()}
                            className="px-5 py-2 bg-[#9D6638] hover:bg-[#87552c] active:bg-[#724522] text-white font-semibold text-sm rounded-xl shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Add
                        </button>
                    </div>
                </form>

                {/* Todos List */}
                <div className="bg-white/90 border border-[#B0BA99] backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg shadow-[#9D6638]/10 min-h-[250px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-[#4E220F]/60">
                            <div className="w-8 h-8 border-2 border-[#9D6638] border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-sm">Loading your tasks...</p>
                        </div>
                    ) : visibleTodos && visibleTodos.length > 0 ? (
                        <ul className="space-y-3">
                            {visibleTodos.map((todo) => (
                                <li
                                    key={todo.id}
                                    className={`group flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                                        todo.done
                                            ? "bg-[#F7F1DE]/60 border-[#B0BA99]/50 text-[#4E220F]/40"
                                            : "bg-[#F7F1DE]/40 border-[#B0BA99] text-[#4E220F] hover:border-[#9D6638]"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <button
                                            type="button"
                                            onClick={() => markAsDone(todo.id)}
                                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                                                todo.done
                                                    ? "bg-[#9D6638] border-[#9D6638] text-white"
                                                    : "border-[#9D6638] hover:bg-[#B0BA99]/40 text-transparent"
                                            }`}
                                            title={todo.done ? "Completed" : "Mark as done"}
                                        >
                                            <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>

                                        <span className={`text-sm truncate select-none ${todo.done ? "line-through text-[#4E220F]/40" : "text-[#4E220F]"}`}>
                                            {todo.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!todo.done && (
                                            <button
                                                onClick={() => markAsDone(todo.id)}
                                                className="px-3 py-1 text-xs font-semibold text-[#4E220F] bg-[#B0BA99] hover:bg-[#a0ab88] border border-[#9D6638]/20 rounded-lg transition-all duration-150"
                                            >
                                                Mark as done
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="p-1.5 text-[#4E220F]/50 hover:text-rose-700 hover:bg-rose-100/80 rounded-lg transition-all duration-150"
                                            title="Delete todo"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-[#B0BA99]/40 flex items-center justify-center text-[#4E220F] mb-3 border border-[#B0BA99]">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-[#4E220F] font-semibold text-sm">No tasks available</h3>
                            <p className="text-[#4E220F]/60 text-xs mt-1">Get started by creating a new task above.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Todo;