// DOM elements

let errorMessage = document.getElementById("error-message");

let searchInput = document.getElementById("search-input");
let sortSelect = document.getElementById("sort-select");
let filterCategory = document.getElementById("filter-category");

let todoList = document.getElementById("todo-list");

let turnOnLoading = () => {
  document.getElementById("loading").style.display = "flex";
};
let turnOffLoading = () => {
  document.getElementById("loading").style.display = "none";
};

let fetchListTodo = () => {
  // turnOnLoading();

  todoService
    .getList()
    .then((res) => {
      //tắt loading
      // turnOffLoading();
      console.log(res);
      let list = res.data;
      console.log(list);
      //có được data rồi thì dùng data chạy hàm renderListTodo để render danh sách
      renderListTodo(list);
    })
    .catch((err) => {
      // turnOffLoading();
      console.log(err);
    });
};

fetchListTodo();

let renderListTodo = (todos) => {
  let contenHTML = "";

  todos.reverse().forEach((todo) => {
    let { id, text, completed, deadline, category } = todo;
    let trString = `<li>
    <div class="task-info">
        <label>
        <input type="checkbox" onclick='updateIsComplete(${completed}, "${id}")' ${
      completed ? "checked" : ""
    }/>
          <span class="task-text">${text}</span>
        </label>
       <span class="deadline">Deadline: ${deadline}</span>
       <span class="category">Category: ${category}</span>
      </div>
      <div class="actions">
        <button class="edit" onclick='editTodo("${id}")'>Edit</button>
        <button onclick='deleteTodo("${id}")' class="delete">Delete</button>
      </div>
      </li>`;

    contenHTML += trString;
  });
  document.getElementById("todo-list").innerHTML = contenHTML;
};

let deleteTodo = (idTodo) => {
  // turnOnLoading();

  todoService
    .deleteById(idTodo)
    .then((res) => {
      console.log("xóa thành xông");
      console.log("res", res);
      fetchListTodo();
      //trong fetch đã có loading ko cần tắt
    })
    .catch((err) => {
      console.log("error", err);
    });
};

let createTodo = () => {
  let text = document.getElementById("todo-input").value;
  let deadline = document.getElementById("deadline-input").value;
  let category = document.getElementById("category-input").value;

  const newTodo = {
    text: text,
    completed: false,
    deadline: deadline,
    category: category,
  };

  todoService
    .createTodos(newTodo)
    .then((res) => {
      console.log("thêm thành công", res);
      //sau khi xóa thành công => gọi api lấy danh sách mới từ sever
      fetchListTodo();
      // text = empty;
      // deadline = empty;
      // category = empty;
      reset();
    })
    .catch((err) => {
      console.log("err", err);
    });
};

let idEdited = null;

let editTodo = (id) => {
  idEdited = id;

  todoService
    .getById(id)
    .then((res) => {
      document.getElementById("todo-input").value = res.data.text;
      document.getElementById("deadline-input").value = res.data.deadline;
      document.getElementById("category-input").value = res.data.category;

      document.getElementById("update-btn").style.display = "block";
    })
    .catch((err) => {
      console.log(err);
    });
};

let updateTodoApp = () => {
  let text = document.getElementById("todo-input").value;
  let deadline = document.getElementById("deadline-input").value;
  let category = document.getElementById("category-input").value;

  const editedTodo = {
    text: text,
    deadline: deadline,
    category: category,
  };
  console.log(editedTodo);
  todoService
    .updateTodo(editedTodo, idEdited)
    .then((res) => {
      document.getElementById("update-btn").style.display = "none";

      reset();
      fetchListTodo();
    })
    .catch((err) => {
      console.log(err);
    });
};

let updateIsComplete = (currentStatus, id) => {
  let nextStatus = !currentStatus;

  let updatedTodo = {
    completed: nextStatus,
  };
  todoService
    .updateTodo(updatedTodo, id)
    .then((res) => {
      console.log(res.data.completed);
      fetchListTodo();
    })
    .catch((err) => {
      console.log(err);
    });
};

let checkSearch = () => {
  let text = document.getElementById("search-input").value;

  let letterSearch = text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");

  todoService.getList().then((res) => {
    let todoData = res.data;

    if (letterSearch) {
      todoData = todoData.filter((item) => {
        let text = (item.text || "")
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "d");

        return text.includes(letterSearch);
      });
    }

    renderListTodo(todoData);
  });
};

let sortTodo = (value) => {
  todoService
    .getList()
    .then((res) => {
      let list = res.data;
      if (value) {
        list = sortList(list, value);
      }

      renderListTodo(list);
    })
    .catch((err) => {
      console.log("error", err);
    });
};

let sortList = (todos, order) => {
  if (order === "asc" || order === "desc") {
    return todos.sort((a, b) => {
      //Sort deadline
      let dateA = new Date(a.deadline);
      let dateB = new Date(b.deadline);

      //Sort Completed
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  }

  if (order === "status") {
    return todos.sort((a, b) => b.completed - a.completed);
  }

  if (order === "work" || order === "study" || order || "personal") {
    todos = todos.filter((item) => {
      return order === "work"
        ? item.category === "work"
        : order === "study"
        ? item.category === "study"
        : item.category === "personal";
    });
  }
  return todos; //Nếu không nằm trong 3 trường hợp trên thì ko sort hiện từ api như bình thường
};

let reset = () => {
  document.querySelector("form").reset();
};
