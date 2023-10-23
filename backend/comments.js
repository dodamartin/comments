const express = require('express');
const db = require('./db');
const transporter = require('./email');
require('dotenv').config();

const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM comments ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Error fetching comments:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});

router.post('/', (req, res) => {
    // Handle POST requests for comments
    const { email, text } = req.body;
    const insertQuery = 'INSERT INTO comments (email, text) VALUES (?, ?)';
    const values = [email, text];

    db.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'An error occurred while saving the comment.' });
        } else {
            const newComment = { id: results.insertId, email, text };

            // Send an email from the same address as the commenter
            const mailOptions = {
                from: email,
                to: process.env.EMAIL_TO,
                subject: 'New Comment Added',
                text: `A new comment was added:\nEmail: ${email}\nComment: ${text}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.json(newComment);
        }
    });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const deleteQuery = 'DELETE FROM comments WHERE id = ?';

    db.query(deleteQuery, [id], (err, results) => {
        if (err) {
            console.error('Error deleting comment:', err);
            res.status(500).json({ error: 'An error occurred while deleting the comment.' });
        } else {
            res.status(200).json({ message: 'Comment deleted successfully' });
        }
    });
});

module.exports = router;
