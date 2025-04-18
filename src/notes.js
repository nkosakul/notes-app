import { insertDB, getDB, saveDB }  from './db.js'

export const newNote = async (note, tags) => {
  const data = {
    id: Date.now(),
    content: note,
    tags,
  }

  await insertDB(data)
}

export const getAllNotes = async () => {
  const { notes } = await getDB()
  return notes
}

export const findNote = async filter => {
  const { notes } = await getAllNotes()
  
  return notes.filter(note => note.content.toLowerCase().includes(filter.toLowerCase()))
}

export const removeNote = async id => {
  const { notes } = await getDB()
  const match = notes.find(note => note.id === id)

  if (!match) return
  
  const newNotes = notes.filter(note => note.id !== id)
  await saveDB({ notes: newNotes })
}

export const removeAllNotes = () => saveDB({ notes: [] })