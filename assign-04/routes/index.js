'use strict';

const Joi = require('joi');
const Boom = require('boom');
const uuid = require('node-uuid');
const express = require('express');

const router = express.Router();

const LibrarySchema = Joi.object().keys({
    title: Joi.string().min(10).max(40).required(),
    isbn: Joi.number(). required(),
    author: Joi.string().min(10).max(50).required(),
    genre: Joi.string().min(10).max(40).required(),
    publisher: Joi.string().min(10).max(40).required(),
    availability: Joi.string().min(8).max(9).required(),
        })    

const updateLibrarySchema = Joi.object().keys({
    title: Joi.string().min(10).max(40).optional(),
    author: Joi.string().min(15).max(50).optional(),
    isbn: Joi.number().optional(),
    genre: Joi.string().min(10).max(40).optional(),
    publisher: Joi.string().min(10).max(40).optional(),
    availability: Joi.string().min(8).max(9).optional(),
    }).required().min(1)
  

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/books',
        handler: function (request, reply) {

            db.books.find((err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB connectivity error'));
                }

                reply(docs);
            });

        }
    });

    

    server.route({
        method: 'POST',
        path: '/books',
        handler: function (request, reply) {

            const book = request.payload;

            
            book._id = uuid.v1();

            db.books.save(book, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB connectivity error'));
                }

                reply(book);
            });
        },
        config: {
            validate: {
                payload: LibrarySchema
                      }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/books/{id}',
        handler: function (request, reply) {

            db.books.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB connectivity error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(206);
            });
        },
        config: {
            validate: {
                payload: updateLibrarySchema
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/books/{id}',
        handler: function (request, reply) {

            db.books.findOne({
                _id: request.params.id
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB connectivity error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });

        }
    });

    server.route({
        method: 'DELETE',
        path: '/books/{id}',
        handler: function (request, reply) {

            db.books.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB connectivity error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(206);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-books'
};

router.get('/healthCheck', (request, reply) =>
  respond.send('Fine')
);

