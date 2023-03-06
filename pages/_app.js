import '../styles/global.css'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
      <title>chatbotApp</title>
      <link rel="stylesheet" href="../styles/global.css" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
    </Head>
    <Component {...pageProps} />
    </>
)}