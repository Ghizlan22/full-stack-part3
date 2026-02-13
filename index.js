const express = require('express')
const app = express()

// Middleware pour parser le JSON (important pour les requêtes POST)
app.use(express.json())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-01-10T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    date: "2022-01-10T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-01-10T19:20:14.298Z",
    important: true
  }
]

// Route pour la page d'accueil
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// Route pour obtenir toutes les notes
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

// Route pour obtenir une note spécifique par ID (Exercice 3.1)
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// Route pour supprimer une note (Exercice 3.1)
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

// Route pour ajouter une nouvelle note (Exercice 3.1)
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    id: Math.floor(Math.random() * 1000000), // ID temporaire
    content: body.content,
    date: new Date(),
    important: body.important || false,
  }

  notes = notes.concat(note)
  response.status(201).json(note)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})