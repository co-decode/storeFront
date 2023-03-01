export default function About() {
  return (
    <>
      <div className="aboutBg"></div>
      <div className="position-relative aboutDiv">
        <h1 className="display-2 offset-1">
          About <span style={{ whiteSpace: "nowrap" }}>My Fitness Store:</span>
        </h1>
        <p className="offset-1 firstP me-4">
          This site is a personal project for the demonstration of the following
          technologies: </p>
          <div className="svgCollection mt-4 offset-1 mb-4">
        <div className="mongodb"></div>
        <div className="nodejs"></div>
        <div className="graphql"></div>
        <div className="apollo"></div>
        <div className="urql"></div>
        <div className="vite"></div>
        <div className="typescript"></div>
        <div className="react"></div>
        <div className="redux"></div>
        <div className="html"></div>
        <div className="css"></div>
        <div className="git"></div>
        <div className="github"></div>
        <div className="heroku"></div>
        <div className="netlify"></div>
      </div>
        <p className="offset-1 me-4">
          The database is deployed on MongoDB Atlas, <br />
          The server is deployed from Railway, <br />
          The client is hosted with Netlify.
        </p>
        <p className=" offset-1 me-4">
          All images were obtained under Creative Commons licence <br />
          Images for shop items and backgrounds were obtained from{" "}
          <em>pexels.com</em> <br />
          Thank you to Ivan Samkov and Lukas. <br />
          SVG images were obtained from <em>svgrepo.com</em>
        </p>
        
      </div>
      
    </>
  );
}
