import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/";

export const getUsers = async () => {
    try {
        const response = await axios.get('users');
        return response.data
    }catch(e) {
        console.log(e)
    }
}