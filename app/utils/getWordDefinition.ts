import axios from "axios";

export async function getWordDefinition(word: string) {
  const url = `https://en.wiktionary.org/w/api.php`;
  const params = {
    action: "query",
    format: "json",
    titles: word,
    prop: "extracts",
    exintro: true,
    explaintext: true,
    origin: "*",
  };

  try {
    const response = await axios.get(url, { params });
    const pages = response.data.query.pages;
    const page: any = Object.values(pages)[0];
    return page.extract || "No definition found.";
  } catch (error) {
    console.error("Error fetching definition:", error);
    return "Error fetching definition.";
  }
}
