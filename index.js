const express = require('express')
const app = express()

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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  
  if (isNaN(id)) {
    return response.status(400).json({ error: 'malformatted id' })
  }
  
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).json({ error: 'note not found' })
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  
  if (isNaN(id)) {
    return response.status(400).json({ error: 'malformatted id' })
  }
  
  const noteExists = notes.some(note => note.id === id)
  
  if (!noteExists) {
    return response.status(404).json({ error: 'note not found' })
  }
  
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  if (body.content.length < 3) {
    return response.status(400).json({ error: 'content must be at least 3 characters long' })
  }

  if (body.important !== undefined && typeof body.important !== 'boolean') {
    return response.status(400).json({ error: 'important must be a boolean' })
  }

  const existingNote = notes.find(note => note.content === body.content)
  if (existingNote) {
    return response.status(400).json({ error: 'note with same content already exists' })
  }

  const ids = notes.map(note => note.id)
  const maxId = notes.length > 0 ? Math.max(...ids) : 0

  const note = {
    id: maxId + 1,
    content: body.content,
    date: new Date(),
    important: body.important || false,
  }

  notes = notes.concat(note)
  response.status(201).json(note)
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})