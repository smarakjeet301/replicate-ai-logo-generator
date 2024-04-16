import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='full-screen bg-black flex flex-col items-center md:bg-cover bg-[url(https://bcassetcdn.com/assets/images/designcom/hero-banner-background/bg-pattern-wave.png)] md:bg-[url(https://bcassetcdn.com/assets/images/designcom/hero-banner-background/hero-spage-logo.png)]'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
