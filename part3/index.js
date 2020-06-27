require('dotenv').config();
const express = require('express');
const app = express();
const Person = require('./models/person');
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

morgan.token('req-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body'
  )
);

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people);
  });
});

app.get('/info', (request, response, next) => {
  const date = new Date();
  Person.find({})
    .then(people => {
      response.send(
        `<p>Phonebook has info for ${people.length} people</p><p>${date}</p>`
      );
    })
    .catch(err => {
      next(err);
    });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(err => {
      next(err);
    });
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(err => {
      next(err);
    });
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson);
    })
    .catch(err => {
      next(err);
    });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
