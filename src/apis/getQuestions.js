import axios from "axios";
import { server_address } from "../config";

export const getQuestions_api = () => axios.get(server_address + '/questions', {}, { withCredentials: true })