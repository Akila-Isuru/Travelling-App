import api from "../api/axiosInspector";

// අපි මේකට interface එකක් දාලා object එකක් ගන්න විදිහට හදමු
interface FetchParams {
  search?: string;
  category?: string;
}

export const getAllDestinations = async (params?: FetchParams) => {
  const urlParams = new URLSearchParams();

  if (params?.search) urlParams.append("search", params.search);
  if (params?.category) urlParams.append("category", params.category);

  const url = urlParams.toString()
    ? `/destinations?${urlParams.toString()}`
    : "/destinations";

  const res = await api.get(url);
  return res.data;
};

export const getDestinationBySlug = async (slug: string) => {
  const res = await api.get(`/destinations/slug/${slug}`);
  return res.data;
};
