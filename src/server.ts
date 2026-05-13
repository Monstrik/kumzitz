import dotenv from "dotenv";
import express from "express";
import path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.urlencoded({ extended: true }));


app.get("/", async (req, res) => {

    const { data: songs, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return res.send(error.message);
    }

    res.render('index', { songs });
});

app.get("/admin", (req, res) => {
    res.render('admin');
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

app.get("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const { data: song, error } = await supabase
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return res.send(error.message);
    }

    res.render('edit', { song });
});

app.post("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const { title, chords, video_url } = req.body;

    const { error } = await supabase
        .from("songs")
        .update({ title, chords, video_url })
        .eq("id", id);

    if (error) {
        return res.send(error.message);
    }

    res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from("songs")
        .delete()
        .eq("id", id);

    if (error) {
        return res.send(error.message);
    }

    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});