const Course = require('../models/Course');
const StudentDetails = require('../models/StudentDetails');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name')
      .select('-modules.lectures');
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name expertise');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get courses for a student
exports.getStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const courses = await Course.find({ studentsEnrolled: studentId })
      .populate('instructor', 'name')
      .select('-modules.lectures');
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    const newCourse = await course.save();
    
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Enroll a student in a course
exports.enrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if student is already enrolled
    if (course.studentsEnrolled.includes(studentId)) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }
    
    // Add student to course
    course.studentsEnrolled.push(studentId);
    await course.save();
    
    res.json({ message: 'Student enrolled successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update lecture completion status
exports.updateLectureStatus = async (req, res) => {
  try {
    const { courseId, moduleId, lectureId, completed } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    const lecture = module.lectures.id(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    
    lecture.completed = completed;
    
    // Check if all lectures in the module are completed
    const allLecturesCompleted = module.lectures.every(l => l.completed);
    if (allLecturesCompleted) {
      module.completed = true;
    } else {
      module.completed = false;
    }
    
    await course.save();
    
    res.json({ message: 'Lecture status updated', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};