/*********************************************************************************
 * WEB422 – Assignment 1
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Marcus Brown Student ID: 127900223 Date: 2024/01/19
 *
 * Published URL: https://listings-api-xa0v.onrender.com/
 *
 **********************************************************************************/
const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const ListingsDB = require('./modules/listingsDB.js');
const db = new ListingsDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});
app.post('/api/listings', async (req, res) => {
  await db
    .addNewListing(req.body)
    .then((newListing) => {
      res.send(newListing);
    })
    .catch(() => {
      res.json({ message: 'error' });
    });
});
app.get('/api/listings', async (req, res) => {
  await db
    .getAllListings(req.query.page, req.query.perPage, req.query.name || '')
    .then((listings) => {
      res.send(listings);
    })
    .catch(() => {
      res.json({ message: 'error' });
    });
});
app.get('/api/listings/:id', async (req, res) => {
  await db
    .getListingById(req.params.id)
    .then((listing) => {
      res.send(listing);
    })
    .catch(() => {
      res.json({ message: 'error' });
    });
});
app.put('/api/listings/:id', async (req, res) => {
  await db
    .updateListingById(req.body, req.params.id)
    .then(() => {
      res.json({ messgae: 'success' });
    })
    .catch(() => {
      res.json({ message: 'error' });
    });
});
app.delete('/api/listings/:id', async (req, res) => {
  await db
    .deleteListingById(req.params.id)
    .then(() => {
      res.json({ message: 'success' });
    })
    .catch(() => {
      res.json({ message: 'error' });
    });
});
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
