import axios from "axios";
import { server } from "../../../server";

// Get User
const getUser = async () => {
    const response  = await axios.get(`${server}/user/getUser`, {withCredentials: true});
    return response.data.user;
}

// Register User
const register = async (userData) => {
    const response  = await axios.post(`${server}user/create-user`, userData);
    return response.data.user;
}

const userService = {
    getUser,
    register,
}

export default userService;