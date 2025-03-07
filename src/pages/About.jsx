import React from "react";
import "./style/About.css";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconWorld,
  IconSchool,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

function About() {
  const authors = [
    {
      name: "Vojta Riedl",
      email: "vojtariedl66@gmail.com",
      img: "VojtaRiedl",
      linkedinUrl: "https://www.linkedin.com/in/vojt%C4%9Bch-riedl-791216272/",
      githubUrl: "https://github.com/VojtechRiedl",
      webUrl: "",
      work: "Backend Developer v DCUK",
      workUrl: "https://dcuk.cz/",
      school: "UJEP",
      schoolUrl: "https://www.ujep.cz/",
    },
    {
      name: "Ladislav Pokorný",
      email: "ladislavpokorny05@gmail.com",
      img: "LadislavPokorný",
      linkedinUrl: "https://www.linkedin.com/in/ladislav-pokorny/",
      githubUrl: "https://github.com/lagemaxl",
      webUrl: "https://ladislavpokorny.cz/",
      work: "Frontend Developer v DCUK",
      workUrl: "https://dcuk.cz/",
      school: "SPSUL",
      schoolUrl: "https://www.spsul.cz/",
    },
    {
      name: "Tomáš Kroupa",
      email: "tom@bagros.eu",
      img: "TomášKroupa",
      linkedinUrl: "https://www.linkedin.com/in/kroupatom/",
      githubUrl: "https://github.com/LosBagros",
      webUrl: "http://bagros.eu/",
      work: "DCUK, XDENT, CDN77",
      school: "SPSUL",
      schoolUrl: "https://www.spsul.cz/",
    },
  ];

  return (
    <div className="about-container">
      <h1>O aplikaci</h1>
      <p>Tento projekt vznikl na hackathonu <b><a href="https://hackujstat.cz/" target="_blank"> &lt;HackujStátv6/&gt;</a></b> a slouží k ...</p>

      <h2>Technologie</h2>
      <h3>Frontend</h3>
      <ul className="tech-list">
        <li>React</li>
        <li>React Router</li>
        <li>Leaflet</li>
        <li>React Leaflet</li>
      </ul>
      <h3>Backend</h3>
      <ul className="tech-list">
        <li>FastApi</li>
        <li>MariaDb</li>
      </ul>

      <h2>Autoři</h2>
      <motion.div
        className="author-list"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.3 },
          },
        }}
      >
        {authors.map((author, index) => (
          <AuthorCard key={index} {...author} custom={index} />
        ))}
      </motion.div>
    </div>
  );
}

function AuthorCard({
  name,
  email,
  img,
  linkedinUrl,
  githubUrl,
  webUrl,
  work,
  workUrl,
  school,
  schoolUrl,
  custom,
}) {
  return (
    <motion.div
      className="author-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: custom * 0.3 }}
    >
      <img src={`img/${img}.jpg`} alt={name} className="author-img" />
      <h3>{name}</h3>
      <a href={schoolUrl} target="_blank">
        <div className="school">
          <IconSchool color="black" /> <p>{school}</p>
        </div>
      </a>
      <a href={workUrl} target="_blank">
        <p>{work}</p>
      </a>
      <p>
        <a href={`mailto:${email}`} className="email-link">
          {email}
        </a>
      </p>
      <div className="author-links">
        {linkedinUrl && (
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            <IconBrandLinkedin size={24} />
          </a>
        )}
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <IconBrandGithub size={24} />
          </a>
        )}
        {webUrl && (
          <a href={webUrl} target="_blank" rel="noopener noreferrer">
            <IconWorld size={24} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default About;
