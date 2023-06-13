const connexion = require('../../../db-config');
const db = connexion.promise();

const getAll = (req, res) => {
  db.query('select * from albums')
    .then(([albums]) => {
      res.status(200).json(albums);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const getOne = (req, res) => {
  const id = parseInt(req.params.id);
  db.query('select * from albums where id = ?', [id])
    .then(([albums]) => {
      if (albums[0] != null) {
        res.status(200).json(albums[0]);
      } else {
        res.status(404).send('Not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const getTracksByAlbumId = (req, res) => {
  const id = req.params.id;
  console.log(req.params);

  db.query(
    'SELECT * FROM tracks JOIN albums ON tracks.id_album = albums.id WHERE albums.id = ?',
    [id]
  )
    .then(([response]) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const postAlbums = (req, res) => {
  const { title, genre, picture, artist } = req.body;
  db.query(
    'insert into albums (title, genre,picture, artist) values (?,?,?, ?)',
    [title, genre, picture, artist]
  )
    .then(([albums]) => {
      res.location(`/api/albums/${albums.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const updateAlbums = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, genre, picture, artist } = req.body;

  db.query(
    'update albums set title = ?, genre = ?, picture = ?, artist = ? where id = ?',
    [title, genre, picture, artist, id]
  )
    .then(([albums]) => {
      if (albums.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch(() => {
      res.status(500).send('Error editing the user');
    });
};

const deleteAlbums = (req, res) => {
  const id = parseInt(req.params.id);

  db.query('delete from albums where id = ?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error deleting the album');
    });
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
