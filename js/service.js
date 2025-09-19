const BASE_URL = "https://68cd2b64da4697a7f3050155.mockapi.io";

let todoService = {
  getList: () => {
    return axios({
      url: `${BASE_URL}/todos`,
      method: "GET",
    });
  },
  deleteById: (idTodo) => {
    let apiUrl = `${BASE_URL}/todos/${idTodo}`;
    return axios({
      url: apiUrl,
      method: "DELETE",
    });
  },

  getById: (idTodo) => {
    return axios({
      url: `${BASE_URL}/todos/${idTodo}`,
      method: "GET",
    });
  },
  createTodos: (newTodo) => {
    //Gọi api tạo todo
    return axios({
      url: `${BASE_URL}/todos`,
      method: "POST",
      data: newTodo,
    });
  },
  updateTodo: (updatedTodo, idEdited) => {
    return axios.put(`${BASE_URL}/todos/${idEdited}`, updatedTodo);
  },
};
