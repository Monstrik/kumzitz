import express from "express";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

type Song = {
    title: string;
    artist: string;
    chords: string;
};

const songs: Song[] = [
    {
        title: "Wonderwall",
        artist: "Oasis",
        chords: `
Em     G       D       A
Today is gonna be the day
`
    }
];

function renderPage(content: string) {
    return `
    <html>
      <head>
        <title>Kumzitz</title>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <style>
          body {
            font-family: Arial;
            background: #111;
            color: white;
            padding: 20px;
            max-width: 700px;
            margin: auto;
          }

          h1 {
            margin-bottom: 30px;
          }

          .song {
            background: #222;
            padding: 16px;
            border-radius: 14px;
            margin-bottom: 20px;
          }

          pre {
            color: #7CFFB2;
            white-space: pre-wrap;
            overflow-x: auto;
          }

          input, textarea {
            width: 100%;
            padding: 12px;
            margin-bottom: 12px;
            border-radius: 10px;
            border: none;
            background: #222;
            color: white;
          }

          button {
            padding: 12px 20px;
            border: none;
            border-radius: 10px;
            background: #4CAF50;
            color: white;
            font-size: 16px;
          }

          a {
            color: #7CFFB2;
          }
        </style>
      </head>

      <body>
        ${content}
      </body>
    </html>
  `;
}

app.get("/", (req, res) => {
    const songsHtml = songs.map(song => `
    <div class="song">
      <h2>${song.title}</h2>
      <p>${song.artist}</p>
      <pre>${song.chords}</pre>
    </div>
  `).join("");

    res.send(renderPage(`
    <h1>🎸 Kumzitz</h1>

    <p>
      <a href="/admin">Admin Panel</a>
    </p>

    ${songsHtml}
  `));
});

app.get("/admin", (req, res) => {
    res.send(renderPage(`
    <h1>➕ Add Song</h1>

    <form method="POST" action="/add-song">

      <input
        name="title"
        placeholder="Song title"
        required
      />

      <input
        name="artist"
        placeholder="Artist"
      />

      <textarea
        name="chords"
        rows="10"
        placeholder="Paste chords here"
        required
      ></textarea>

      <button type="submit">
        Save Song
      </button>

    </form>

    <p>
      <a href="/">← Back</a>
    </p>
  `));
});

app.post("/add-song", (req, res) => {
    const { title, artist, chords } = req.body;

    songs.unshift({
        title,
        artist,
        chords
    });

    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});