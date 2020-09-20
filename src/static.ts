import * as express from 'express'
import * as path from 'path';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'static')))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
})