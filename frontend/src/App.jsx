import { useState, useEffect, useRef } from "react";
import { FcTodoList } from "react-icons/fc";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdOutlineMenuOpen } from "react-icons/md";
// import { IoAddCircleSharp } from "react-icons/io5";
import { MdOutlineAdd } from "react-icons/md";

import { FiCheck } from "react-icons/fi";

import { v4 as uuidv4 } from "uuid";

import Swal from "sweetalert2";
import Checkbox from "react-custom-checkbox";
import moment from "moment";

import Cookies from "js-cookie";

// Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
// import 'swiper/css';

import "./App.css";
import axios from "axios";
import Login from "./components/Login";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState(true);
  const [Todo, setTodo] = useState("");
  const [Tasks, setTasks] = useState([]);

  const [username, setUsername] = useState([]);

  let taskDate = useRef();

  const token = Cookies.get("ki_todo_cookie");

  // console.log('Retrieved cookie:', token);
  // console.log(document.cookie.ki_todo_cookie)
  let AUTH_TOKEN = "Bearer " + token;
  // console.log(AUTH_TOKEN)
  axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
  // const inputbox = useRef('');

  const getTasks = () => {
    axios
      .get("http://localhost:5000/myAllTasks")
      .then((response) => {
        console.log(response.data);

        if (response.data !== "log_in_to_access_data") {
          setTasks(response.data.tasks);
        } else {
          setLoggedIn(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const saveTasks = () => {
    axios
      .post("http://localhost:5000/editTasks", {
        tasks: Tasks,
      })
      .then((response) => {
        if (response.data === "updated_tasks") {
        } else if (response.data === "log_in_to_access_data") {
          setLoggedIn(false);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (loggedIn === true) {
      saveTasks();
    }
  }, [Tasks]);

  useEffect(() => {
    // let ls_tasks = localStorage.getItem("tasks");

    // if (ls_tasks) {
    //   let parsed_tasks = JSON.parse(ls_tasks);
    //   // console.log(parsed_tasks);

    //   setTasks(parsed_tasks);
    // }

    // if (localStorage.getItem("token"))

    axios
      .get("http://localhost:5000/user", {})
      .then((response) => {
        console.log(response.data);

        if (response.data !== "log_in_to_access_data") {
          setLoggedIn(true);
          setName(response.data.name);
          getTasks();
          console.log(Tasks);
        } else {
          setLoggedIn(false);
        }
        // setTasks(response.data.tasks);
      })
      .catch((error) => console.log(error));

    // }
  }, []);

  const inputChange = (e) => {
    setTodo(e.target.value);
  };

  const addTask = () => {
    // setTasks([...Tasks, { Todo, id: uuidv4() ,isFinished: false }]);
    let newTasks = [
      ...Tasks,
      { Todo, id: uuidv4(), isDate: taskDate.current.value, isFinished: false },
    ];

    //
    // let d = new Date(taskDate.current.value);
    // console.log(d);
    // let m = moment().toISOString(d);
    // console.log(m);
    // console.log(moment().toObject());
    // // let now = moment().toISOString()
    // let nowFormatDate = moment().format("YYYY-MM-DD");
    // console.log(nowFormatDate);

    // // Check if before or not-
    // console.log(moment("2010-10-20").isBefore(taskDate.current.value)); // true

    //
    setTasks(newTasks);
    // console.log(Tasks);
    setTodo("");
    // saveToLocalStorage(Tasks);
    // I am giving here different parameter because react does not updates state immediately so it is not getting saved as setState is asynchronous.
    // saveToLocalStorage(newTasks);
    taskDate.current.value = "";
  };

  const checkIfDeadlineFinished = (taskDeadline) => {
    // console.log("Task deadline: ", taskDeadline);
    if (!taskDeadline) {
      return false;
    }

    let nowFormatDate = moment().format("YYYY-MM-DD");
    // console.log(nowFormatDate);

    // Check if before or not-
    // console.log(moment(taskDeadline).isBefore(nowFormatDate)); // true
    return moment(taskDeadline).isBefore(nowFormatDate);
  };

  const formatDate = (date) => {
    // let m = moment().format("DD/MM/YYYY", date);
    // let m = moment().format("DD/MM/YYYY", date);
    // let m = moment().format(date, "DD/MM/YYYY");
    // let m = moment(date).format("DD/LL/YYYY");
    let m = moment(date).format("LL");
    // console.log("Formatted date: " + m);
    return m;
  };

  const editTask = (e, id) => {
    console.log("Edit task.");
    let taskInd = Tasks.findIndex((t) => {
      return t.id == id;
    });
    setTodo(Tasks[taskInd].Todo);
    taskDate.current.value = Tasks[taskInd].isDate;

    // Run delete function to delete this task.
    // deleteTask(e, id);
    // console.log("Deleting: " + id);
    // let delTask = Tasks.filter(t=>{
    //   console.log(t)
    //   return t.id == id;
    // });

    let newTodos = Tasks.filter((t) => {
      return t.id !== id;
    });

    // console.log(newTodos);

    setTasks(newTodos);

    // Set state function is not working because it is asynchronous so use callback inside. or use useEffect but it will render many times each time state changes. Depends if useState and its dependency array is not changing many times.
    // I am giving here different parameter because react does not updates state immediately so it is not getting saved as setState is asynchronous.
    // saveToLocalStorage(newTodos);
  };

  // const handleSetDate = (e) => {
  //   console.log(e.target.value);
  //   taskDate = e.target.value;
  // };

  const deleteTask = (e, id) => {
    // "Confirm"-button

    Swal.fire({
      title: "Are you sure?",
      text: "It will delete the task",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your task has been deleted.",
          icon: "success",
        });

        // console.log("Deleting: " + id);
        // let delTask = Tasks.filter(t=>{
        //   console.log(t)
        //   return t.id == id;
        // });

        let newTodos = Tasks.filter((t) => {
          return t.id !== id;
        });

        // console.log(newTodos);

        setTasks(newTodos);
        // I am giving here different parameter because react does not updates state immediately so it is not getting saved as setState is asynchronous.
        // saveToLocalStorage(newTodos);
      }
    });
  };

  // const toggleFinished = (e) => {
  const toggleFinished = (e, id) => {
    // e.target.checked = !e.target.checked;

    // let id = e.target.name;

    let t_ind = Tasks.findIndex((t) => {
      return t.id === id;
    });
    // console.log(t_ind);
    let newTasks = [...Tasks];
    newTasks[t_ind].isFinished = !newTasks[t_ind].isFinished;
    // console.log(newTasks);
    setTasks(newTasks);
    // saveToLocalStorage(newTasks);
  };

  const clearText = () => {
    setTodo("");
    // or
    // inputbox.current.value = '';
  };

  const saveToLocalStorage = (data) => {
    localStorage.setItem("tasks", JSON.stringify(data));
  };

  const handleLogOut = () => {
    setLoggedIn(false);
    Cookies.remove("ki_todo_cookie");
  };

  if (loggedIn === false) {
    return (
      <>
        <Login />
      </>
    );
  } else {
    return (
      <>
        <div className="flex items-center justify-between">
          <div className="flex justify-evenly items-center w-56 p-2 m-2 bg-white rounded-lg">
            <FcTodoList className="w-10 h-10" />
            <span className="text-xl text-black font-bold">
              {/* Tasks Manager: {name !== "" ? name : ""} */}
              Tasks Manager
            </span>
          </div>
          <div className="flex justify-evenly items-center p-2 m-2 bg-white rounded-full active:bg-slate-100">
            <MdOutlineMenuOpen className="w-10 h-10" />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center rounded-md p-2 bg-white shadow-md w-40">
          <p className="p-2">Hi {username !== "" ? username : ""}</p>

          <button
            className="flex justify-center items-center rounded-md p-2 bg-red-500 shadow-md w-20 active:bg-red-600"
            onClick={handleLogOut}
          >
            <span className="text-white font-bold">Log out</span>
          </button>
        </div>

        {/* <MdOutlineModeEdit />
      <MdOutlineDeleteOutline />
      <IoIosCloseCircleOutline />
      <IoAddCircleSharp />
      <MdOutlineAdd /> */}

        <div className="mx-auto flex justify-center items-center bg-white md:w-4/5 rounded p-2 flex-col border-b-4 border-b-black">
          <div>
            <div className="flex flex-row justify-center items-center flex-wrap">
              <label
                htmlFor="inputtask"
                className="font-bold p-2 bg-slate-500 text-white rounded-md"
              >
                Add task
              </label>
              <input
                type="text"
                name=""
                id="inputtask"
                value={Todo}
                onChange={inputChange}
                // ref={inputbox}
                placeholder="tasks..."
                className="p-2 m-2 rounded-md outline-none bg-slate-50 focus:bg-slate-100 disabled:bg-slate-800"
              />
              {Todo.length > 4 && (
                <button
                  onClick={clearText}
                  className="p-2 m-2 rounded-md outline-none bg-slate-50"
                >
                  <IoIosCloseCircleOutline className="w-8 h-8" />
                </button>
              )}

              <button
                className="flex justify-evenly items-center w-20 bg-slate-50 border-2 border-slate-50 rounded-md p-1 disabled:text-slate-400"
                onClick={addTask}
                disabled={Todo.length < 4}
              >
                <MdOutlineAdd className="w-6 h-6" />
                Add
              </button>
            </div>

            <div className="flex justify-center items-center flex-wrap">
              <label htmlFor="taskdate">Add Date</label>
              <input
                ref={taskDate}
                type="date"
                name=""
                id="taskdate"
                // onChange={handleSetDate}
                className="p-2 m-2 rounded-md outline-none bg-slate-50 focus:bg-slate-100 disabled:bg-slate-800"
              />
            </div>
          </div>
          <div className="m-2 flex justify-evenly items-center flex-wrap md:w-4/6 w-full">
            <span className="font-bold p-2 rounded-xl bg-opacity-10 bg-violet-600 text-violet-600">
              Total: {Tasks.length}
            </span>
            <span className="font-bold p-2 rounded-xl bg-opacity-10 bg-red-600 text-red-600">
              Pending:
              {
                Tasks.filter((t) => {
                  return t.isFinished == false;
                }).length
              }
            </span>
            <span className="font-bold p-2 rounded-xl bg-opacity-10 bg-green-600 text-green-600">
              Finished:
              {
                Tasks.filter((t) => {
                  return t.isFinished == true;
                }).length
              }
            </span>
          </div>
        </div>

        <div className="container min-h-40 flex-col mx-auto my-2 flex justify-center items-center bg-white md:w-4/5 rounded p-2 mt-2">
          {Tasks.length === 0 && <div>Add tasks</div>}
          {Tasks.length !== 0 && (
            <div className="text-blue-400 font-bold">Tasks</div>
          )}
          {Tasks.map((item) => {
            return (
              <div
                key={item.id}
                className="task flex justify-start items-center border-t-2 w-full"
              >
                {/* <span className="bg-gray-100 rounded p-3 my-2"> */}

                <div className="w-2/3 flex justify-start items-center flex-wrap">
                  <span
                    className={
                      item.isFinished
                        ? "line-through bg-green-500 text-white rounded p-3 m-2 font-bold"
                        : "bg-gray-100 rounded p-3 m-2 font-bold"
                    }
                  >
                    {item.Todo}
                  </span>
                </div>

                <div className="btns flex justify-evenly items-center flex-wrap ml-2 w-1/3 m-2">
                  {/*  */}
                  <Checkbox
                    onChange={(e) => toggleFinished(e, item.id)}
                    checked={item.isFinished}
                    icon={
                      <div
                        style={{
                          display: "flex",
                          flex: 1,
                          backgroundColor: "#5ce65c",
                          alignSelf: "stretch",
                        }}
                      >
                        <FiCheck color="black" size={23} />
                      </div>
                    }
                    borderColor="#5ce65c"
                    // borderWidth={0}
                    borderRadius={20}
                    style={{ overflow: "hidden" }}
                    size={25}
                    label="Finished?"
                  />
                  {/*  */}

                  {/* <input
                  type="checkbox"
                  name={item.id}
                  id=""
                  className="m-2 h-5 w-5"
                  onChange={toggleFinished}
                  checked={item.isFinished}
                /> */}

                  <div className="flex justify-evenly items-center">
                    <button
                      onClick={(e) => editTask(e, item.id)}
                      className="flex justify-evenly items-center p-2 m-2 bg-slate-100 rounded"
                    >
                      <MdOutlineModeEdit className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => deleteTask(e, item.id)}
                      className="flex justify-evenly items-center p-2 m-2 bg-slate-100 rounded"
                    >
                      <MdOutlineDeleteOutline className="w-6 h-6" />
                    </button>
                  </div>

                  {item.isDate && (
                    // <span className="bg-blue-600 text-white p-2 rounded-md">
                    <span
                      className={
                        checkIfDeadlineFinished(item.isDate)
                          ? "bg-gray-100 text-red-600 line-through p-2 rounded-md text-xs text-center"
                          : "bg-blue-600 text-white p-2 rounded-md m-2 text-xs text-center"
                      }
                    >
                      {/* {item.isDate} */}
                      {/* {checkIfDeadlineFinished(item.isDate) ? {}} */}
                      {formatDate(item.isDate)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default App;
