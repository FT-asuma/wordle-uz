"use client";
import { useState, ChangeEvent, FormEvent } from "react";

import { FiSearch } from "react-icons/fi";

import styles from "./utils.module.css"; 

// push after registrating
import { useRouter } from "next/navigation";

const SearchBar = ({ mode }: { mode: boolean }) => {
  const [query, setQuery] = useState<string>("");
  const { push } = useRouter();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query && query.length > 2) {
      push(`/meaning/${query}`);
    } else {
      alert("Please fill the blank before searching");
    }
  };

  return (
    <div className={styles.searchbar}>
      <form
        style={
          mode ? { background: "transparent" } : { background: "transparent" }
        }
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <input
          type="text"
          placeholder="Search..."
          value={query}
          style={mode ? { color: "#415a77" } : {}}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="submit" className={styles.iconButton}>
          <FiSearch color={mode ? "#415a77" : "#fff"} fontSize={22} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
