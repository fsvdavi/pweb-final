const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar:', err));


const FavoriteSchema = new mongoose.Schema({ name: String, description: String });
const Favorite = mongoose.model('Favorite', FavoriteSchema);

const NoteSchema = new mongoose.Schema({ topic: String, content: String });
const Note = mongoose.model('Note', NoteSchema);


const router = express.Router();

router.get('/favorites', async (req, res) => {
  const favorites = await Favorite.find();
  res.json(favorites); 
});

router.post('/favorites', async (req, res) => {
  const newFavorite = new Favorite(req.body);
  await newFavorite.save();
  res.json(newFavorite);
});

router.get('/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

router.post('/notes', async (req, res) => {
  const newNote = new Note(req.body);
  await newNote.save();
  res.json(newNote);
});

app.use('/api', router);  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));