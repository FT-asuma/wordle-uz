import Header from "@/components/blocks/Header";
import styles from "./translation.module.css";
import Wrapper from "@/components/container/Wrapper";
import { redirect } from 'next/navigation';

interface PageProps {
  params: { id: string }; // Declare the type for params
}

async function getWordDefinition(word: string) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  const data = await response.json();

  if (data.title === "No Definitions Found") {
    redirect("/")
  } else {
    return data[0];
  }
}

const Page = async ({ params }: PageProps) => {
  const result = await getWordDefinition(params.id.toLocaleLowerCase());
  return (
    <main className={styles.meaning}>
      <Wrapper>
        <div className={styles.definition}>
            <p>{JSON.stringify(result.meanings[0].definitions[0].definition)}</p>
        </div>
      </Wrapper>
    </main>
  );
};

export default Page;
