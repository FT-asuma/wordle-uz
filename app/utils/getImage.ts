import axios from "axios";

export async function getPixabayPhotos(query: string) {
  const response = await axios.get("https://pixabay.com/api/", {
    params: {
      key: "47350466-784b13f08aac9093d5915836c",
      q: query,
      image_type: "photo",
    },
  });
  return response.data.hits;
}
