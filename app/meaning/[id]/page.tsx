import Header from "@/components/blocks/Header";
import styles from "./translation.module.css";
import Wrapper from "@/components/container/Wrapper";
import { redirect } from "next/navigation";
import Navbar from "@/components/blocks/Navbar";

interface PageProps {
  params: { id: string }; // Declare the type for params
}

async function getWordDefinition(word: string) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  const data = await response.json();

  if (data.title === "No Definitions Found") {
    return "An error occured while translating";
  } else {
    return data[0];
  }
}

const Page = async ({ params }: PageProps) => {
  
  const result = await getWordDefinition(params.id.toLocaleLowerCase());
  if (result === "An error occured while translating") {
    return (
      <main className={styles.meaning}>
        <Wrapper>
          <Navbar />
          <h2>
            We are truly sorry about that mistake we are currently working on
            this project
          </h2>
        </Wrapper>
      </main>
    );
  } else
    return (
      <main className={styles.meaning}>
        <Wrapper>
          <Navbar />
          <div className={styles.definition}>
            <p>
              {JSON.stringify(result.meanings[0].definitions[0].definition)}
            </p>
          </div>
        </Wrapper>
      </main>
    );
};

export default Page;
