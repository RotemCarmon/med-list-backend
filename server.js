// Loading .env to the process
require('dotenv').config();
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const xmlparser = require('express-xml-bodyparser');
// Adding JWT
const jwt = require('jsonwebtoken');

const logger = require('./services/logger.service');
const app = express()
const http = require('http').createServer(app);

// Routes
const productRoutes = require('./api/product/product.routes')
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const mailRoutes = require('./api/mail/mail.routes')

const debugRoutes = require('./api/debug/debug.routes')


app.use(cookieParser())
app.use(bodyParser.json({limit: '10mb'}));
app.use(xmlparser());


if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static(path.join(__dirname, '../static')));
    logger.info('NODE is in production mode');
    
} else {
    const corsOptions = {
        origin: [ 'http://127.0.0.1:3000', 'http://localhost:3000', 'http://127.0.0.1:5000', 'http://localhost:5000'],
        credentials: true
    };
    app.use(cors(corsOptions));
}

//######################
// end points
app.use('/api/product', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/mail', mailRoutes)

app.use('/api/debug', debugRoutes)

// Default route
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../static', 'index.html'));
  });




const port = process.env.PORT || 4000;
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
});
