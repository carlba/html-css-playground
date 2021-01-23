import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as MarkdownIt from 'markdown-it';
import * as expressHandlebars from 'express-handlebars';

const md = new MarkdownIt();
const port = 3030;
const applicationPath = __dirname;
const staticFolder = path.join(applicationPath, 'static');

function readMarkdownFile(filepath: string): string {
  return md.render(fs.readFileSync(filepath).toString());
}

function isValidPath(filepath: string) {
  return fs.lstatSync(filepath).isDirectory() && !filepath.startsWith('.');
}

function createApp(port: number, staticFolder: string) {
  const app = express();
  app.set('views', path.join(applicationPath, 'views'));
  app.use('/static', express.static(staticFolder));
  app.use(express.static(path.join(__dirname, '/public')));

  app.engine('handlebars', expressHandlebars());
  app.set('view engine', 'handlebars');

  app.use((req, res) => {
    res.setHeader('content-type', 'text/html');
    fs.readdir(staticFolder, (err, files) => {
      const projects = files
        .map(file => {
          const filepath = path.join(staticFolder, file);
          const readmeFilepath = path.join(filepath, 'README.md');
          if (isValidPath(filepath)) {
            const content = fs.existsSync(readmeFilepath) ? readMarkdownFile(readmeFilepath) : 'No Content';
            return { content, src: `static/${file}`, title: file };
          } else {
            return null;
          }
        })
        .filter(project => project);
      res.render('home', { projects, layout: false });
    });
  });
  return app;
}

const app = createApp(port, staticFolder);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
