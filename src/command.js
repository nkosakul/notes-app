import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { newNote, getAllNotes, findNotes, removeNote, removeAllNotes } from './notes.js';
import { start } from './server.js';

const listNotes = notes => {
  notes.forEach(note => {
    console.log('\n');
    console.log('id: ', note.id);
    console.log('tags: ', note.tags);
    console.log('note: ', note.content);
  })
}

yargs(hideBin(process.argv))
  .scriptName("note")
  .command('new <note>', 'Create a Note', yargs => {
    return yargs.positional('note', {
      type: 'string',
      description: 'The content of the note to create',
    })
  }, async argv => {
    const tags = argv.tags ? argv.tags.split(',').map(tag => tag.trim()) : []
    const note = await newNote(argv.note, tags)
    console.log('New note created:', note);
  })
  .options('tags', {
    alias: 't',
    type: 'string',
    description: 'Tags to add to the note',
  })
  .command('all', 'get all notes', () => {}, async (argv) => {
    const notes = await getAllNotes()
    listNotes(notes)
  })
  .command('find <filter>', 'get matching notes', yargs => {
    return yargs.positional('filter', {
      describe: 'The search term to filter notes by, will be applied to note.content',
      type: 'string'
    })
  }, async (argv) => {
    const matches = await findNotes(argv.filter)
    listNotes(matches)
  })
  .command('remove <id>', 'remove a note by id', yargs => {
    return yargs.positional('id', {
      type: 'number',
      description: 'The id of the note you want to remove'
    })
  }, async (argv) => {
    const id = await removeNote(argv.id)
    console.log(id);
  })
  .command('web [port]', 'launch website to see notes', yargs => {
    return yargs
      .positional('port', {
        describe: 'port to bind on',
        default: 5000,
        type: 'number'
      })
  }, async (argv) => {
    const notes = await getAllNotes()
    start(notes, argv.port)
  })
  .command('clean', 'remove all notes', () => {}, async (argv) => {
    await removeAllNotes()
    console.log('db resetted');
  })
  .demandCommand(1)
  .parse()