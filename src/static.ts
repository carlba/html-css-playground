import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as MarkdownIt from 'markdown-it';
import * as expressHandlebars from 'express-handlebars';

const app = express();
const port = 3030;
const md = new MarkdownIt();
const applicationPath = __dirname;
const staticFolder = path.join(applicationPath, 'static');
app.set('views', path.join(applicationPath, 'views'));
app.use('/static', express.static(staticFolder));
app.use(express.static(path.join(__dirname, '/public')));

app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

function readMarkdownFile(filepath: string): string {
  return md.render(fs.readFileSync(filepath).toString());
}

app.use((req, res) => {
  res.setHeader('content-type', 'text/html');
  fs.readdir(staticFolder, (err, files) => {
    const readmes = files
      .map(file => {
        const filepath = path.join(staticFolder, file);
        const readmeFilepath = path.join(filepath, 'README.md');
        if (
          fs.lstatSync(filepath).isDirectory() &&
          fs.existsSync(readmeFilepath)
        ) {
          return {
            content: readMarkdownFile(readmeFilepath),
            src: `static/${file}`,
            title: file,
          };
        } else {
          return null;
        }
      })
      .filter(readme => readme);
    res.render('home', {readmes, layout: false});
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
