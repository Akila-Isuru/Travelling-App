import api from "../api/axiosInspector";

export const getAllDestinations = async (search?: string) => {
  const url = search ? `/destinations?search=${search}` : "/destinations";
  const res = await api.get(url);
  return res.data;
};

export const getDestinationBySlug = async (slug: string) => {
  const res = await api.get(`/destinations/slug/${slug}`);
  return res.data;
};
