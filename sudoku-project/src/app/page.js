import Image from "next/image";
import styles from "./page.module.css";
import SudokuGrid from "./components/SudokuGrid";

export default function Home() {
  return (
    <div className={styles.page}>
      <SudokuGrid />
    </div>
  );
}
