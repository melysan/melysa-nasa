import axios from "axios"
import { useEffect, useState } from "react"
import Image from "next/image";
import styles from '@/styles/Home.module.css';
import Link from "next/link";
import Head from "next/head";


export default function Polychromatic() {

    const [image, setImage] = useState([]);
    const [images, setImages] = useState([]);
    const [time, setTime] = useState("loading");
    const [date, setDate] = useState("");
    const [coords, setCoords] = useState({});

    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;
    const url = `https://epic.gsfc.nasa.gov/api/natural?api_key=${apiKey}`

    const getPolychromaticData = async () => {
        const res = await axios.get(url)
        const data = await res.data;
        console.log(data);

        const caption = data[0].caption;
        const date = data[0].date.split(" ")[0]; //splits by the space and grabs the position 0
        const date_formatted = date.replaceAll("-", "/"); //replaces the - in dates with /

        let times = [];
        let images = [];

        for (let i = 0; i < data.length; i++) {
            let time = data[i].date.split(" ")[1]; //grabbing time which is in position 1 since date is in position 0 from split
            let coords = data[i].centroid_coordinates;
            let imageGrabbed = data[i].image;

            let image = `https://epic.gsfc.nasa.gov/archive/natural/${date_formatted}/png/${imageGrabbed}.png`

            times.push(time);
            images.push({
                image: image,
                time: time,
                coords: coords
            })
        }

        setDate(date);
        setImages(images);

        setImage(images[0].image);
        setTime(times[0]);
        setCoords([images[0].coords.lat, images[0].coords.lon]);

        console.log(image);
    }

    useEffect(() => {
        getPolychromaticData();
    }, [])

    return (
        <>
            <Head>
                <title>NASA Trek - Polychromatic</title>
                <meta name="description" content="NASA API Web App" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Link className={styles.polychromaticLink} href={"/"}>Warp to Home</Link>

            <div className={styles.mainPoly}>


                <div className={styles.polyMainImageCont}>
                    <h1 className={styles.polyHeader}>Polychromatic</h1>
                    <Image className={styles.polyMainImage}
                        src={image} alt={image} width={300} height={300} />
                    <div>{time}</div>
                    <div>{coords[0]}, {coords[1]}</div>
                </div>

                <table className={styles.polyTable}>
                    <thead>
                        <tr>
                            <th className={styles.polyTableHead}>Time</th>
                            <th className={styles.polyTableHead}>Latitude</th>
                            <th className={styles.polyTableHead}>Longitude</th>
                            <th className={styles.polyTableHead}>Image</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            images.map((e, i) => {
                                return (
                                    <tr key={i}>
                                        <td className={styles.polyTableHead}>{e.time}</td>
                                        <td className={styles.polyTableHead}>{e.coords.lat}</td>
                                        <td className={styles.polyTableHead}>{e.coords.lon}</td>
                                        <td><Image className={styles.polyMainImage} src={e.image} alt={i} width={200} height={200} /></td>
                                        <td>
                                            <button
                                                className={styles.polyButton}
                                                onClick={() => {
                                                    setImage(e.image);
                                                    setTime(e.time);
                                                    setCoords([e.coords.lat, e.coords.lon]);
                                                    console.log(images[i]);
                                                    document.body.scrollIntoView();
                                                }}>View</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}