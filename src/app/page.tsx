'use client'
import styles from "./page.module.css";
import {AuthProvider} from "@/contexts/auth";
import WebApp from "@/components/main/webapp";

export default function Home() {
  return (
      <AuthProvider>
      <main className={styles.main}>
        <WebApp/>
      </main>
      </AuthProvider>
  );
}
