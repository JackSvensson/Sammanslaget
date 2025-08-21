"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './home.module.css';

export default function Home() {
  const router = useRouter();

  const handleStartTraining = () => {
    router.push('/chooseRoute');
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.phoneContainer}>
        {/* Status bar */}
        <div className={styles.statusBar}>
          <span className={styles.statusBarTime}>9:41</span>
          <div className={styles.statusBarIcons}>
            <span>📶</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Huvudinnehåll med bakgrundsbild */}
        <main className={styles.mainContent}>
          {/* Bakgrundsbild */}
          <div className={styles.backgroundImage}>
            <Image 
              src="/exercises/start.svg"
              alt="Träningsbakgrund"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          {/* Innehållscontainer */}
          <div className={styles.contentContainer}>
            {/* LindMotion logo/titel */}
            <div className={styles.logoSection}>
              <h1 className={styles.appTitle}>LindMotion</h1>
            </div>

            {/* Välkomstsektion */}
            <div className={styles.welcomeSection}>
              <h2 className={styles.welcomeTitle}>Välkommen!</h2>
              <p className={styles.welcomeText}>
                Träna dina favoritövningar för en starkare kropp, på vackra Lindholmen.
              </p>
            </div>

            {/* Träna nu knapp */}
            <div className={styles.buttonSection}>
              <button 
                onClick={handleStartTraining}
                className={styles.startButton}
              >
                TRÄNA NU
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}