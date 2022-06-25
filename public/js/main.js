// Chức năng
// 1 thêm công việc cần làm
// 2 sửa
// 3 xóa

let todos;

const todoListEl = document.querySelector(".todo-list");
const todoOptionEls = document.querySelectorAll(".todo-option-item input");
const todoInputEl = document.getElementById("todo-input");
const btnAdd = document.getElementById("btn-add");

// lấy danh sách api
let getTodos = async () => {
  try {
    let res = await axios.get("/todos");
    todos = res.data;

    renderTodo(todos);
  } catch (error) {
    console.log(error);
  }
};

const renderTodo = (arr) => {
  todoListEl.innerHTML = "";
  // kiểm tra danh sách công việc có trống hay không
  if (arr.length == 0) {
    todoListEl.innerHTML =
      "<p class='todos-empty'>Không có công việc nào trong danh sách</p>";
    return;
  }

  // Hiển thị danh sách
  let html = "";
  arr.forEach((t) => {
    html += `
        <div class="todo-item ${t.status ? "active-todo" : ""}">
        <div class="todo-item-title">
            <input type="checkbox" ${t.status ? "checked" : ""} 
            onclick="toggleStatus(${t.id})"/>
            <p>${t.title}</p>
            <input type="text" class="text text${t.id} hide" value="${
      t.title
    }"  />
        </div>
        <div class="option">
            <button class="btn btn-update" onclick="updateTodo(${t.id})">
                <img src="./img/pencil.svg" alt="icon" />
            </button>
            <button class="btn btn-delete" onclick="deleteTodo(${t.id})">
                <img src="./img/remove.svg" alt="icon" />
            </button>
        </div>
        </div>`;
  });
  todoListEl.innerHTML = html;
};

// xóa công việc
const deleteTodo = async (id) => {
  try {
    await axios.delete(`/todos/${id}`); // chỉ xóa trên db không phải từ client
    // để không phải mất một bước gán nữa thì ta lọc luôn cho nhanh
    // lọc các cv khác id của công việc muốn xóa
    todos = todos.filter((todo) => todo.id !== id);
    // hiển thị lại giao diện
    renderTodo(todos);
  } catch (error) {
    console.log(error);
  }
};

// thay đổi trạng thái công việc
const toggleStatus = async (id) => {
  try {
    // lấy ra công việc cần thay đổi
    let todo = todos.find((todo) => todo.id == id);
    // thay đổi trạng thái của công việc đó
    todo.status = !todo.status;

    // gọi api
    await axios.put(`/todos/${id}`, todo);
    // hiển thị lại giao diện
    // renderTodo(todos);
    renderTodo(todos);
  } catch (error) {
    console.log(error);
  }
};

// // lọc công việc theo trạng thái
// Array.from(todoOptionEls).forEach((input) => {
//   input.addEventListener("change", () => {
//     let option = input.value;

//     let todosFilter = [];
//     switch (option) {
//       case "all":
//         todosFilter = [...todos];
//         break;
//       case "active":
//         todosFilter = todos.filter((todo) => todo.status == true);
//         break;
//       case "unactive":
//         todosFilter = todos.filter((todo) => todo.status == false);
//         break;

//       default:
//         todosFilter = [...todos];
//         break;
//     }
//     renderTodo(todosFilter);
//   });
// });

const addTodo = async () => {
  try {
    // lấy dữ liệu trong ô input
    let title = todoInputEl.value;
    //kiểm tr tiêu đề có trống hay không
    if (title == "") {
      alert("Tiêu đề công việc không được để trống");
      return;
    }

    // tạo công việc mới
    let newTodo = {
      title: title,
      status: false,
    };

    // gọi api tạo mới
    let res = await axios.post("/todos", newTodo);
    // thêm vào mảng để quản lý
    todos.push(res.data);

    renderTodo(todos);
    // setDataToLocalStorage(todos);
    todoInputEl.value = "";
  } catch (error) {
    console.log(error);
  }
};
// thêm công việc
btnAdd.addEventListener("click", () => {
  addTodo();
});

// khi nhấn phím enter
todoInputEl.addEventListener("keydown", (event) => {
  if (event.code == "Enter") {
    addTodo();
  }
});

// // lấy dữ liệu từ localstorage
// const getDataFromLocalstorage = () => {
//   let data = localStorage.getItem("todos");
//   if (data) {
//     todos = JSON.parse(data);
//   } else {
//     todos = [];
//   }
//   renderTodo(todos);
// };

// // lưu dữ liệu vào localstorage
// const setDataToLocalStorage = (arr) => {
//   localStorage.setItem("todos", JSON.stringify(arr));
//   renderTodo(arr);
// };

// // update todo
// const updateTodo = (id) => {
//   const text = document.querySelector(`.text${id}`);

//   text.previousElementSibling.classList.toggle("hide");
//   // text.focus();
//   text.addEventListener("keydown", (event) => {
//     if (event.code == "Enter") {
//       updateTodo();
//     }
//   });
//   if (!text.classList.contains("hide")) {
//     updateTodo();
//   }
//   text.classList.toggle("hide");

//   const updateTodo = () => {
//     let todo = todos.find((todo) => todo.id == id);
//     todo.title = text.value;
//     setDataToLocalStorage(todos);
//   };
// };

// getDataFromLocalstorage();

getTodos();
