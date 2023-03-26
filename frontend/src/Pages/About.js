import React from 'react'
import image from "../Images/Gambit.png";
const About = () => {
  return (
    <section className='about'>
      <img src={image} alt="gambit" />
      <p>
        Welcome to Gambit, a chess website where you can play chess with your friends while chatting in real-time, or watch top games from lichess.org, a popular chess website. Our platform is built using React on the frontend and Node.js with Express and WebSockets on the backend, developed by <a href="https://github.com/Carbrex">Carbrex</a> (Lakshya Kumar). You can find the source code <a href="https://github.com/Carbrex">here</a>, where you are welcome to contribute to the project or report any issues you encounter.<br/>
        We hope you enjoy playing chess on Gambit as much as we enjoyed creating it!
      </p>
    </section>
  )
}

export default About