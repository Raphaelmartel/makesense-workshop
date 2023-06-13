const connexion = require('../../../db-config');
const db = connexion.promise();

const getOne = (req, res) => {
  const id = parseInt(req.params.id);
  db.query('select * from tracks where id = ?', [id])
    .then(([tracks]) => {
      if (tracks[0] != null) {
        res.status(200).json(tracks[0]);
      } else {
        res.status(404).send('Not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const getAll = (req, res) => {
  db.query('select * from tracks')
    .then(([tracks]) => {
      res.status(200).json(tracks);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const postTracks = (req, res) => {
  const { title, youtube_url, id_album } = req.body;
  db.query('insert into tracks (title, youtube_url, id_album) values (?,?,?)', [
    title,
    youtube_url,
    id_album,
  ])
    .then(([tracks]) => {
      res.location(`/api/tracks/${tracks.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const updateTracks = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, youtube_url, id_album } = req.body;

  db.query(
    'update tracks set title = ?, youtube_url = ?, id_album = ? where id = ?',
    [title, youtube_url, id_album, id]
  )
    .then(([tracks]) => {
      if (tracks.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error editing the user');
    });
};

const deleteTracks = (req, res) => {
  const id = parseInt(req.params.id);

  db.query('delete from tracks where id = ?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error deleting the track');
    });
};

module.exports = { getOne, getAll, postTracks, updateTracks, deleteTracks };
