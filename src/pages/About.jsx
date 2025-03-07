import React from "react";
import "./style/About.css";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconWorld,
} from "@tabler/icons-react";

function About() {
  return (
    <div className="about-container">
      <h1>O aplikaci</h1>
      <p>
        Tato aplikace je vytvořena v rámci předmětu{" "}
        <strong>Programování pro web a mobilní zařízení</strong> na{" "}
        <strong>Fakultě informatiky Masarykovy univerzity</strong>.
        <br />
        <br />
        Aplikace zobrazuje mapu České republiky s kraji a okresy. Po kliknutí na
        kraj se zobrazí jeho název.
      </p>

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
      <div className="author-list">
        <AuthorCard
          name="Ladislav Pokorný"
          email="ladislavpokorny05@gmail.com"
          img="LadislavPokorný"
          linkedinUrl="https://www.linkedin.com/in/ladislav-pokorny/"
          githubUrl="https://github.com/lagemaxl"
          webUrl="https://ladislavpokorny.cz/"
          work="Frontend Developer v DCUK"
          workUrl="https://dcuk.cz/"
        />
        <AuthorCard
          name="Tomáš Kroupa"
          email="tom@bagros"
          img="TomášKroupa"
          linkedinUrl="https://www.linkedin.com/in/kroupatom/"
          githubUrl="https://github.com/LosBagros"
          webUrl="http://bagros.eu/"
          work="DCUK, XDENT, CDN77"
        />
        <AuthorCard
          name="Vojta Riedl"
          email="vojtariedl66@gmail.com"
          img="VojtaRiedl"
          linkedinUrl="https://www.linkedin.com/in/vojt%C4%9Bch-riedl-791216272/"
          githubUrl="https://github.com/VojtechRiedl"
          webUrl=""
          work="Backend Developer v DCUK"
          workUrl="https://dcuk.cz/"
        />
      </div>
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
}) {
  return (
    <div className="author-card">
      <img src={`img/${img}.jpg`} alt={name} className="author-img" />
      <h3>{name}</h3>
      <a href={workUrl}>
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
    </div>
  );
}

export default About;
