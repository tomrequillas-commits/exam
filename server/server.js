const express = require('express');

const cors = require('cors');

const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const Student = require('./models/Students');

app.use(cors());
app.use(express.json());

// MongoDB 
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});


app.get('/', (req, res) => {
    res.send('Server is running');
});

// READ 
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving students'
        });
    }
});

// CREATE 
app.post('/students', async (req, res) => {
    try {
        const student = new Student({
            name: req.body.name,
            course: req.body.course,
            age: req.body.age
        });

        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error adding student'
        });
    }
});

// UPDATE 
app.put('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                course: req.body.course,
                age: req.body.age
            },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating student'
        });
    }
});

// DELETE 
app.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.json({
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting student'
        });
    }
});


app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});