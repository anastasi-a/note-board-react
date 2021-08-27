import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3000/notes",
  headers: {
    "Content-Type": "application/json"
  }
});
