const express = require('express');
const db = require('../data/config'); // an instance of knex that's already connected to our database, so we can use this to execute SQL queries

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const posts = await db.select('*').from('posts'); // translates to SELECT * FROM "POSTS"
		res.json(posts);
	} catch (err) {
		next(err);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		// translates to SELECT * FROM "POSTS" WHERE "ID" = ? LIMIT 1;
		const post = await db.first('*').from('posts').where('id', req.params.id);
		res.json(post);
	} catch (err) {
		next(err);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const payload = {
			title: req.body.title,
			contents: req.body.contents
		};

		// translats to UPDATE posts SET ? = ? WHERE id = ?
		const [ id ] = await db('posts').insert(payload);
		const newPost = await db('posts').where('id', id).first();
		res.json(newPost);
	} catch (err) {
		next(err);
	}
});

router.put('/:id', async (req, res, next) => {
	try {
		const payload = {
			title: req.body.title,
			contents: req.body.contents
		};

		await db('posts').where('id', req.params.id).update(payload);
		const post = await db('posts').where('id', req.params.id).first();
		res.json(post);
	} catch (err) {
		next(err);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		await db('posts').where('id', req.params.id).del();
		res.status(204).end();
	} catch (err) {
		next(err);
	}
});

module.exports = router;
