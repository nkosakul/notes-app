import fs from 'node:fs/promises'
import http from 'node:http'
import open from 'open'

const interpolate = (html, data) => {
  // replace {{ notes }} -> data.notes
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || '';
  });
}

const formatNotes = notes => {
  return notes.map(note => {
    return `<li class="note">
      <h2>${note.content}</h2>
       <ul class="tags">
        ${note.tags.map(tag => `<li class="tag">${tag}</li>`).join('')}
       </ul>
    </li>`;
  }).join('');
}

const createServer = notes => {
  return http.createServer(async (req, res) => {
    const HTML_PATH = new URL('./index.html', import.meta.url).pathname
    const template = await fs.readFile(HTML_PATH, 'utf-8')
    const html = interpolate(template, {
      notes: formatNotes(notes),
    })

    res.writeHead(200, {
      'Content-Type': 'text/html',
    })
    res.end(html)
  })
}

export const start = (notes, port) => {
  const server = createServer(notes)
  server.listen(port, () => {
    const address = `http://localhost:${port}`

    console.log(`Server running at ${address}`)
    open(address)
  })
}
