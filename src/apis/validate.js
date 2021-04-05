import axios from "axios"
import { server_address } from "../config"

export const validate_api = data => axios.post(server_address + '/validate', data, { withCredentials: true })
