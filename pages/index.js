import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {

  const [data, setData] = useState();

  const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;
  const url = `https://api.nasa.gov/techtransfer/patent/?q=10&engine&api_key=${apiKey}`

  const getTechTransferData = async () => {
    const res = await axios.get(url);
    const info = await res.data;
    console.log(info);
    setData(info);
  }

  useEffect(() => {
    getTechTransferData()
  }, [])

  return (
    <>
      <Head>
        <title>NASA Trek - Home</title>
        <meta name="description" content="NASA API Web App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link className={styles.polychromaticLink} href={"/polychromatic"}>Warp To Polychromatic</Link>
      <main className={styles.main}>
        {   //need loop in a loop cause array in an array for the data

          data && data.results.map((tech, index) => {
            return (
              <div className={styles.techCont} key={index}>
                {
                  tech && tech.map((t, ind) => {
                    if (ind === 10) {
                      return (
                        <Image className={styles.techImage} src={t} alt={t} key={ind} width={100} height={100} />
                      )
                    }
                  })
                }
              </div>
            )
          })
        }
      </main>
    </>
  )
}
