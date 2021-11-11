const express = require('express');
const cors = require("cors")
const connection = require('./db-config');
const app = express();

const port = process.env.PORT || 8000;

connection.connect((err) => {
    if (err) {
      console.error('error connecting: ' + err.stack);
    } else {
      console.log('connected as id ' + connection.threadId);
    }
  });

app.use(express.urlencoded({extend : true}));
app.use(express.json());
app.use(cors());

app.get("/", cors(), async (req, res) => {
    res.send("This is working");
});

app.get("/api/argonautes", cors(), async (req, res) => {
    connection.query('SELECT * FROM argonautes', (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving argonautes from database');
          } else {
            res.json(result);
          }
    })
})

app.get("/api/argonautes/:id", cors(), async (req, res) => {
    const argonauteId = req.params.id;
    connection.query(
        'SELECT * FROM argonautes WHERE id = ?',
            [argonauteId],
        (err, results) => {
          if (err) {
            res.status(500).send('Error retrieving argonaute from database');
          } else {
            if (results.length) res.json(results[0]);
            else res.status(404).send('Argonaute not found');
          }
        }
      );
})

app.post("/api/argonautes", cors(), async (req,res) => {
    const { name, qualities } = req.body
    connection.query(
        'INSERT INTO argonautes (name, qualities) VALUES (?, ?)',
        [name, qualities],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error saving the argonaute');
            } else {
                const id = result.insertId;
                const createdArgonautes = { id, name, qualities};
                res.status(201).json(createdArgonautes)
            }
        }
    )
});

app.put("/api/argonautes/:id", cors(), async (req,res) => {
    const argonauteId = req.params.id;
    const db = connection.promise();
    let existingArgonaute = null;
    db.query('SELECT * FROM argonautes WHERE id = ?', [argonauteId])
        .then(([results]) => {
            existingArgonaute = results[0];
            if (!existingArgonaute) return Promise.reject('RECORD_NOT_FOUND');
            return db.query('UPDATE argonautes SET ? WHERE id = ?', [req.body, argonauteId]);
        })
        .then(() => {
            res.status(200).json({ ...existingArgonaute, ...req.body });
        })
        .catch((err) => {
            console.error(err);
            if (err === 'RECORD_NOT_FOUND')
                res.status(404).send(`Argonaute with id ${argonauteId} not found.`);
            else res.status(500).send('Error updating a argonaute');
        });
});

app.delete('/api/argonautes/:id', cors(), async (req, res) => {
    connection.query(
        'DELETE FROM argonautes WHERE id = ?',
        [req.params.id],
        (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error deleting an argonaute');
        } else {
            if (result.affectedRows) res.status(200).send('🎉 Argonaute deleted!');
            else res.status(404).send('Argonaute not found.');
        }
        }
    );
});

app.listen(port, () => console.log(`Server listening on port ${port}`));

module.exports = app;