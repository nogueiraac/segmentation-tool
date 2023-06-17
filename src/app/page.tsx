import Image from 'next/image'
import styles from './page.module.css'
import medusas from "../assets/medusas.jpeg"
export default function Home() {
  return (
    <main className={styles.main}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Image src={medusas} alt='medusas' width={300} height={300}/>
        <h1 style={{ color: 'black', marginTop: '24px' }}>Medusas Eye`s</h1>
      </div>
    </main>
  )
}
