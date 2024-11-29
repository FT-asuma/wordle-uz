import Header from "@/components/blocks/Header";
import styles from "./translation.module.css";
import Wrapper from "@/components/container/Wrapper";
import { redirect } from "next/navigation";
import Navbar from "@/components/blocks/Navbar";
import ThemeChanger from "@/components/blocks/ThemeChanger";
import { Suspense } from "react";
import Loading from "./loading";
import Link from "next/link";
import SearchBar from "@/components/utils/Searchbar";
import AudioPlayer from "@/components/utils/AudioPlayer";
import { getPixabayPhotos } from "@/app/utils/getImage";
import { PixabayImage } from "@/constants/interface";
import ImageContainer from "@/components/utils/ImageContainer";

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
  // const foundImage: PixabayImage[] = await getPixabayPhotos(params.id);
  if (result === "An error occured while translating") {
    return (
      <Suspense fallback={<Loading />}>
        <ThemeChanger>
          <main
            style={{
              flexDirection: "column",
              gap: "1rem",
            }}
            className={styles.meaning}
          >
            <h2>
              We are truly sorry about that mistake we are currently working on
              this project
            </h2>
            <p>
              <i>You may checkout the meaning of this word from: </i>
            </p>
            <br />
            <Link href={`https://en.wikipedia.org/wiki/${params.id}`}>
              {params.id.toUpperCase()} --{">"}
            </Link>
          </main>
        </ThemeChanger>
      </Suspense>
    );
  } else {
    return (
      <Suspense fallback={<Loading />}>
        <ThemeChanger>
          <main className={styles.meaning}>
            <div className={styles.information}>
              <div className={styles.aboutWord}>
                <div className={styles.theWord}>
                  <h1 style={{ textTransform: "capitalize" }}>{result.word}</h1>
                  <h3>
                    {result.phonetic
                      ? result?.phonetic
                      : result.phonetics[1]?.text}
                  </h3>
                </div>
                <div className={styles.audioPlay}>
                  <AudioPlayer word={params.id} />
                </div>
              </div>
            </div>
            {result.meanings.slice(0, 4).map(
              (i: {
                partOfSpeech: string;
                definitions: {
                  definition: string;
                  synonyms: string[];
                  antonyms: string[];
                  example: string;
                }[];
                synonyms: string[];
                antonyms: string[];
              }) => {
                const example = i.definitions.find(
                  (item) => item.example
                )?.example;
                console.log(example);
                return (
                  <div className="" key={i.partOfSpeech + Math.random()}>
                    <article className={styles.next}>
                      <h3>
                        <i>{i.partOfSpeech}</i>
                      </h3>{" "}
                      <span />
                    </article>
                    <div className={styles.information}>
                      <div
                        style={{
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                        className={styles.aboutWord}
                      >
                        <div className={styles.title}>
                          <p>Meaning</p>
                        </div>
                        <ul className={styles.meaningList}>
                          {i.definitions.slice(0, 5).map((item) => {
                            return (
                              <li key={item.example}>{item.definition}</li>
                            );
                          })}
                        </ul>
                        {i.synonyms.length ? (
                          <div className={styles.title}>
                            <p>Synonyms:</p>
                            <div className={styles.listOfSynonyms}>
                              {i.synonyms.slice(0, 3).map((synonym) => (
                                <Link
                                  href={`/meaning/${synonym}`}
                                  key={synonym + i.partOfSpeech + Math.random()}
                                >
                                  <b>{synonym};</b>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {i.antonyms.length ? (
                          <div className={styles.title}>
                            <p>Antonyms:</p>
                            <div className={styles.listOfSynonyms}>
                              {i.antonyms.slice(0, 3).map((antonym) => (
                                <Link
                                  href={`/meaning/${antonym}`}
                                  key={antonym + i.partOfSpeech + Math.random()}
                                >
                                  <b>{antonym};</b>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {example ? (
                          <div className={styles.title}>
                            <p>Example:</p>
                            <div className={styles.listOfSynonyms}>
                              <p>
                                <i>{example};</i>
                              </p>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </main>
        </ThemeChanger>
      </Suspense>
    );
  }
};

export default Page;
