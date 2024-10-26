import React, { useState, useEffect, useRef } from "react";
import { FcTodoList } from "react-icons/fc";
import {
  MdOutlineModeEdit,
  MdOutlineDeleteOutline,
  MdOutlineAdd,
  MdLogout,
} from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiCheck, FiUser } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import Checkbox from "react-custom-checkbox";
import moment from "moment";
import Cookies from "js-cookie";
import axios from "axios";
import Login from "./components/Login";
import "./App.css";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "./components/ui/button";

// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Separator } from "./components/ui/separator";

// Define the Task interface
interface Task {
  Todo: string;
  id: string;
  isDate?: string;
  isFinished: boolean;
}

interface UserData {
  _id: string;
  full_name: string;
  user_email:	string;
  tasksLen: number;
}

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [Todo, setTodo] = useState<string>("");
  const [Tasks, setTasks] = useState<Task[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const taskDate = useRef<HTMLInputElement>(null);
  const token = Cookies.get("ki_todo_cookie");
  let AUTH_TOKEN = "Bearer " + token;

  axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

  const getTasks = () => {
    axios
      .get("http://localhost:5000/myAllTasks")
      .then((response) => {
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
        if (response.data === "log_in_to_access_data") {
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
    axios
      .get("http://localhost:5000/user")
      .then((response) => {
        if (response.data !== "log_in_to_access_data") {
          setLoggedIn(true);
          setUserData(response.data);
          getTasks();
        } else {
          setLoggedIn(false);
        }
      })
      .catch((error) => console.log(error));
  }, [loggedIn]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  const addTask = () => {
    if (taskDate.current) {
      let newTasks: Task[] = [
        ...Tasks,
        {
          Todo,
          id: uuidv4(),
          isDate: taskDate.current.value,
          isFinished: false,
        },
      ];
      setTasks(newTasks);
      setTodo("");
      taskDate.current.value = "";
    }
  };

  const checkIfDeadlineFinished = (taskDeadline?: string) => {
    if (!taskDeadline) {
      return false;
    }
    let nowFormatDate = moment().format("YYYY-MM-DD");
    return moment(taskDeadline).isBefore(nowFormatDate);
  };

  const formatDate = (date: string) => {
    return moment(date).format("LL");
  };

  const editTask = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    let taskInd = Tasks.findIndex((t) => t.id === id);
    setTodo(Tasks[taskInd].Todo);
    if (taskDate.current) {
      taskDate.current.value = Tasks[taskInd].isDate || "";
    }
    let newTodos = Tasks.filter((t) => t.id !== id);
    setTasks(newTodos);
  };

  const deleteTask = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
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

        let newTodos = Tasks.filter((t) => t.id !== id);

        setTasks(newTodos);
      }
    });
  };

  const toggleFinished = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    let t_ind = Tasks.findIndex((t) => t.id === id);

    let newTasks = [...Tasks];

    newTasks[t_ind].isFinished = !newTasks[t_ind].isFinished;

    setTasks(newTasks);
  };

  const clearText = () => {
    setTodo("");
  };

  const handleLogOut = () => {
    Swal.fire({
      title: "Do you want to log out?",

      showCancelButton: true,
      confirmButtonColor: 'crimson',
      confirmButtonText: "Log Out",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoggedIn(false);

        Cookies.remove("ki_todo_cookie");
      }
    });
  };

  if (loggedIn === null) {
    return (
      <>
        <div className="flex justify-center items-center h-[100vh] w-full">
          <div className="flex justify-evenly items-center w-56 h-56 p-2 m-2 bg-white rounded-xl shadow-md">
            <FcTodoList className="w-10 h-10" />
            <span className="text-xl text-black font-bold">
              {/* Tasks Manager: {name !== "" ? name : ""} */}
              Tasks Manager
            </span>
          </div>
        </div>
      </>
    );
  }

  if (loggedIn === false) {
    return (
      <>
        <Login setLog={setLoggedIn} />
      </>
    );
  } else {
    return (
      <>
        <div className="flex items-center justify-between">
          <div className="flex justify-evenly items-center w-56 p-2 m-2 bg-white rounded-xl shadow-md">
            <FcTodoList className="w-10 h-10" />
            <span className="text-xl text-black font-bold">
              {/* Tasks Manager: {name !== "" ? name : ""} */}
              Tasks Manager
            </span>
          </div>
          {/* <div className="flex justify-evenly items-center p-2 m-2 bg-white rounded-xl shadow-md">
            <p className="p-2">Hi {username !== "" ? username : ""}</p>

            <button
              className="flex justify-center items-center rounded-md p-2 bg-red-500 shadow-md w-20 active:bg-red-600"
              onClick={handleLogOut}
            >
              <span className="text-white font-bold">Log out</span>
            </button>
          </div> */}


          <Popover>
            <PopoverTrigger className="flex justify-evenly items-center p-2 m-2 bg-white rounded-xl shadow-md"><FiUser size={20} /></PopoverTrigger>
            <PopoverContent className="bg-white right-1 flex justify-evenly items-center flex-col p-3 rounded-xl absolute shadow-md w-56 h-48">
              <p className="p-2 text-black bg-slate-100 rounded-xl">
                Hello {userData !== null ? userData.full_name : ""}
              </p>
              <p className="p-2 text-white bg-black rounded-xl">
                Email: {userData !== null ? userData.user_email : ""}
              </p>
              <Separator />
              <button
                className="flex justify-evenly items-center rounded-md p-2 bg-red-500 shadow-md active:bg-red-600"
                onClick={handleLogOut}
              >
                <MdLogout color="white" size={25}/>
                <span className="text-white font-bold">Log out</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>

        {/* <div className="flex flex-col justify-center items-center rounded-md p-2 bg-white shadow-md w-40 logOutdiv">
          <p className="p-2">Hi {username !== "" ? username : ""}</p>

          <button
            className="flex justify-center items-center rounded-md p-2 bg-red-500 shadow-md w-20 active:bg-red-600"
            onClick={handleLogOut}
          >
            <span className="text-white font-bold">Log out</span>
          </button>
        </div> */}

        {/* <MdOutlineModeEdit />
      <MdOutlineDeleteOutline />
      <IoIosCloseCircleOutline />
      <IoAddCircleSharp />
      <MdOutlineAdd /> */}

        <div className="mx-auto flex justify-center items-center bg-white md:w-4/5 rounded-xl p-2 flex-col border-b-4 border-b-black shadow-md">
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
                placeholder="Add tasks..."
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

        <div className="container shadow-md min-h-40 flex-col mx-auto my-2 flex justify-center items-center bg-white md:w-4/5 rounded p-2">
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
                    onChange={({
                      e,
                    }: {
                      e: React.ChangeEvent<HTMLInputElement>;
                    }) => toggleFinished(e, item.id)}
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
