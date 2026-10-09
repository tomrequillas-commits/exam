import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [age, setAge] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/students');
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const student = {
        name: name,
        course: course,
        age: Number(age)
      };

      if (editingId) {
        await axios.put(
          `http://localhost:5000/students/${editingId}`,
          student
        );
      } else {
        await axios.post('http://localhost:5000/students', student);
      }

      setName('');
      setCourse('');
      setAge('');
      setEditingId(null);

      getStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (student) => {
    setName(student.name);
    setCourse(student.course);
    setAge(String(student.age));
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      getStudents();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Student Management System</h1>

      <h2>{editingId ? 'Edit Student' : 'Add Student'}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <button type="submit">
          {editingId ? 'Update Student' : 'Add Student'}
        </button>
      </form>

      <h2>Students</h2>

      {students.map(student => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>

          <button onClick={() => handleEdit(student)}>
            Edit
          </button>

          <button onClick={() => handleDelete(student._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;