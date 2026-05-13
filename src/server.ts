import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

type Song = {
    title: string;
    artist: string;
    chords: string;
};

const songsFilePath = path.join(
    process.cwd(),
    "src/data/songs.json"
);

function loadSongs(): Song[] {
    const data = fs.readFileSync(
        songsFilePath,
        "utf-8"
    );

    return JSON.parse(data);
}

function saveSongs(songs: Song[]) {
    fs.writeFileSync(
        songsFilePath,
        JSON.stringify(songs, null, 2)
    );
}

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

          .song {
            background: #222;
            padding: 16px;
            border-radius: 14px;
            margin-bottom: 20px;
          }

          pre {
            color: #7CFFB2;
            white-space: pre-wrap;
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

app.get("/", async (req, res) => {

    const { data: songs, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return res.send(error.message);
    }

    const songsHtml = songs.map(song => `
    <div class="song">
      <h2>${song.title}</h2>

      <pre>${song.chords}</pre>

      ${
        song.video_url
            ? `<p><a href="${song.video_url}" target="_blank">Video</a></p>`
            : ""
    }

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
    <h1>Add Song</h1>

    <form method="POST" action="/add-song">

    <input
  name="title"
  placeholder="Song title"
  required
/>

<textarea
  name="chords"
  rows="10"
  placeholder="Chords"
  required
></textarea>

<input
  name="video_url"
  placeholder="YouTube URL"
/>
    

      <button type="submit">
        Save Song
      </button>

    </form>

    <p>
      <a href="/">← Back</a>
    </p>
  `));
});

app.post("/add-song", async (req, res) => {

    const { title, chords, video_url } = req.body;

    const { error } = await supabase
        .from("songs")
        .insert({
            title,
            chords,
            video_url
        });

    if (error) {
        return res.send(error.message);
    }

    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});