import * as express from 'express'
import * as path from 'path';
import * as fs from 'fs';
import * as MarkdownIt from 'markdown-it'



const app = express();
const port = 3000;
const md = new MarkdownIt();
const applicationPath = path.join(__dirname, 'static');

app.use('/static', express.static(applicationPath))

app.use((req, res) => {
  res.setHeader('content-type', 'text/html')
  fs.readdir(applicationPath, (err, files) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My static files</title>
    <link rel="stylesheet" href="styles/index.processed.css">
  </head>
  <body> 
    <h1>Index</h1>
    <script src="scripts/index.js"></script>
  `;
    
    res.write(html)
    
    res.write('<ul>')
    for (const file of files ) {
      res.write(`<li><a href='static/${file}'>${file}</a></li>`)
      if (fs.lstatSync(path.join(applicationPath, file)).isDirectory() )
      res.write(md.render(fs.readFileSync(path.join(applicationPath, file, 'README.md')).toString()))
    }

    res.write('</ul>')
    res.write(`
    </body>
    </html>
    `)
    res.status(200).end();
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${3000}`)
})
