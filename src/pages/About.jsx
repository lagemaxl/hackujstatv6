import { useState } from "react";
import "./style/About.css";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconWorld,
  IconSchool,
  IconMail,
} from "@tabler/icons-react";
import { color, motion } from "motion/react";

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
      maturita: true,
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
      maturita: false,
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
      maturita: false,
    },
  ];

  const listVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2, // postupné zobrazování položek
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="about-container">
      <h1>O aplikaci</h1>
      <p>
        Tento projekt vznikl na hackathonu{" "}
        <b>
          <a href="https://hackujstat.cz/" target="_blank">
            {" "}
            &lt;HackujStátv6/&gt;
          </a>
        </b>{" "}
        a slouží jako pomocník při hledání školy. Aplikace zobrazuje školy a
        školské zařízení v České republice a umožňuje vyhledávat podle různých
        kritérií.đ
      </p>

      <h2>Technologie</h2>
      <h3>Frontend</h3>
      <motion.ul
        className="tech-list"
        initial="hidden"
        animate="visible"
        variants={listVariants}
      >
        <motion.li variants={itemVariants}>React</motion.li>
        <motion.li variants={itemVariants}>React Router</motion.li>
        <motion.li variants={itemVariants}>Leaflet</motion.li>
        <motion.li variants={itemVariants}>React Leaflet</motion.li>
      </motion.ul>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Backend
      </motion.h3>

      <motion.ul
        className="tech-list"
        initial="hidden"
        animate="visible"
        variants={listVariants}
      >
        <motion.li variants={itemVariants}>FastAPI</motion.li>
        <motion.li variants={itemVariants}>MariaDB</motion.li>
      </motion.ul>

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
  const [kingMode, setKingMode] = useState(false);
  return (
    <motion.div
      className="author-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: custom * 0.3 }}
      style={
        name === "Vojta Riedl" && kingMode
          ? { border: "2px solid gold", scale: "1.5", marginRight: "5em" }
          : {}
      }
    >
      <img
        src={name === "Vojta Riedl"  && kingMode ? "img/VojtaRiedlKing.jpg" : `img/${img}.jpg`}
        alt={name}
        className="author-img"
      />

      {name === "Vojta Riedl" && kingMode ? (
        <h3 className="gold-text">{name}</h3>
      ) : (
        <h3>{name}</h3>
      )}
      <a href={schoolUrl} target="_blank">
        <div className="school">
          <IconSchool color="black" /> <p>{school}</p>
        </div>
      </a>
      <a href={workUrl} target="_blank">
        <p>{work}</p>
      </a>
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
        {email && (
          <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
            <IconMail size={24} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default About;
