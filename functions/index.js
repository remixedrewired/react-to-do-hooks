const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')({ origin: true });
const app = express();

const admin = require('firebase-admin')
admin.initializeApp()

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const query = admin.database().ref('/items');

app.get('/getItems', async (req, res) => {
  try {
    let messages = [];
    const snapshot = await query.once('value');
    snapshot.forEach(childSnapshot => {
        const val = childSnapshot.val();
        messages.push({key: childSnapshot.key, message: val.text, isCompleted: val.isCompleted});
      });
    res.status(200).json(messages);
  } catch(e) {
    console.log(e);
    res.status(500).send(`Could not retrieve Messages...`);
  }
})

app.post('/addItem', async (req, res) => {
  const { item } = req.body;
  try {
    const obj = JSON.parse(item);
    const snapshot = await query.push(obj);
    res.status(200).send({ key: snapshot.key });
  } catch(e) {
    console.log(e);
    res.status(500).send(`Could not store the message: ${e}`);
  }
})

app.put('/updateItem', async (req, res) => {
  const { updatedItem, key } = req.body;
  try {
    const updObj = JSON.parse(updatedItem);
    await query.child(key).update(updObj);
    res.status(201).send(`Item successfully updated`);
  } catch(e) {
    console.log(e);
    res.status(500).send(`Could not update the item: ${e}`)
  }
  
})

app.delete('/deleteItem', async (req, res) => {
  const { key } = req.body;
  try {
    await query.child(key).remove();
    res.status(201).send(`Item successfully removed`);
  } catch(e) {
    console.log(e);
    res.status(500).send(`Could not remove the item: ${e}`);
  }
})

exports.api = functions.https.onRequest(app);