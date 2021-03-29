const express = require('express');
const path = require('path');
const PORT = 8080;
const cors = require('cors');


const options = {
    origin: 'http://react.app.com:8080',
    credentials: false,
};


const  app = express();
app.use(cors(options));
app.use(express.static(path.resolve(__dirname)));
app.use(express.json());


app.listen(PORT, () => {
    console.log(`Server was started on port ${PORT}.`);
});