import express from "express";

const app = express();
const PORT = 3000;

const songs = [
    {
        title: "Wonderwall",
        artist: "Oasis",
        chords: `
Em     G       D       A
Today is gonna be the day
`
    },
    {
        title: "Knockin' on Heaven's Door",
        artist: "Bob Dylan",
        chords: `
G    D
Mama take this badge from me
Am7  C
I can't use it anymore
`
    }
];

app.get("/", (req, res) => {
    const html = `
    <html>
      <head>
        <title>Kumzitz</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: Arial;
            padding: 20px;
            background: #111;
            color: white;
          }

          .song {
            background: #222;
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
          }

          pre {
            white-space: pre-wrap;
            color: #7CFFB2;
          }
        </style>
      </head>
      <body>
        <h1>🎸 My Songs</h1>

        ${songs.map(song => `
          <div class="song">
            <h2>${song.title}</h2>
            <p>${song.artist}</p>
            <pre>${song.chords}</pre>
          </div>
        `).join("")}

      </body>
    </html>
  `;

    res.send(html);
});

app.listen(PORT, () => {
    console.log("Server running:");
    console.log(`http://localhost:${PORT}`);
});