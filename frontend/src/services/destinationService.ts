import axios from "axios";
import api from "../api/axiosInspector";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1", // ඔයාගේ backend එකේ URL එක මෙතන හරියටම දෙන්න
});

export const getAllDestinations = async (search?: string) => {
  const url = search ? `/destinations?search=${search}` : "/destinations";
  const res = await api.get(url);
  return res.data;
};
