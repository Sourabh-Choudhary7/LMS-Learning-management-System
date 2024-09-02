import Course from '../models/course.model.js';
import AppError from '../utils/error.utils.js';
import cloudinary from 'cloudinary'
import fs from 'fs/promises';
import path from 'path';

const getAllCourses = async (req, res, next) => {

  try {
    // const courses = await Course.find({}).select('-lectures');
    const courses = await Course.find({})
    res.status(200).json({
      success: true,
      message: 'All courses',
      courses,
    })
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}

const createCourse = async (req, res, next) => {

  try {

    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
      return next(new AppError('All fields are required', 400));
    }

    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
    });

    if (!course) {
      return next(
        new AppError('Course could not be created, please try again', 400)
      );
    }

    // Run only if user sends a file
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms', // Save files in a folder named lms
        });

        // If success
        if (result) {
          // Set the public_id and secure_url in array
          course.thumbnail.public_id = result.public_id;
          course.thumbnail.secure_url = result.secure_url;
        }

        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      } catch (error) {
        // Empty the uploads directory without deleting the uploads directory
        for (const file of await fs.readdir('uploads/')) {
          await fs.unlink(path.join('uploads/', file));
        }

        // Send the error message
        return next(
          new AppError(
            JSON.stringify(error) || 'File not uploaded, please try again',
            400
          )
        );
      }
    }

    // Save the changes
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    });

  } catch (error) {
    return next(new AppError(error.message, 500));
  }


}

const getLecturesByCourseId = async (req, res, next) => {

  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError('Invalid course id or course not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Course lectures fetched successfully',
      lectures: course.lectures,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}

const updateCourseById = async (req, res, next) => {

  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body, // This will only update the fields which are present
      },
      {
        runValidators: true, // This will run the validation checks on the new data
      }
    );

    if (!course) {
      return next(new AppError('Course not found, please try again.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }

}

const addLectureToCourseById = async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;



  if (!title || !description) {
    return next(new AppError('Title and Description are required', 400));
  }

  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError('Invalid course id or course not found.', 400));
  }

  let lectureData = {
    title,
    description,
    lecture: {},
  };
  // Run only if user sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms', // Save files in a folder named lms
        //   chunk_size: 50000000, // 50 mb size
        //   resource_type: 'video',
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in array
        lectureData.lecture.public_id = result.public_id;
        lectureData.lecture.secure_url = result.secure_url;
      }

      // After successful upload remove the file from local storage
      fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      // Empty the uploads directory without deleting the uploads directory
      for (const file of await fs.readdir('uploads/')) {
        await fs.unlink(path.join('uploads/', file));
      }

      // Send the error message
      return next(
        new AppError(
          JSON.stringify(error) || 'File not uploaded, please try again',
          400
        )
      );
    }
  }

  course.lectures.push(lectureData);

  course.numberOfLectures = course.lectures.length;

  // Save the course object
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course lecture added successfully',
    course,
  });
}

const deleteCourseById = async (req, res, next) => {

  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError('Invalid course id or course not found.', 400));
    }

    await Course.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });

  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}

const removeLectureFromCourse = async (req, res, next) => {
  try {

    const { courseId, lectureId } = req.query;

    if (!courseId) {
      return next(new AppError('Course ID is required', 400));
    }

    if (!lectureId) {
      return next(new AppError('Lecture ID is required', 400));
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new AppError('Invalid ID or Course does not exist.', 404));
    }

    // Find the index of the lecture using the lectureId
    const lectureIndex = course.lectures.findIndex(
      (lecture) => lecture._id.toString() === lectureId.toString()
    );

    // If returned index is -1 then send error as mentioned below
    if (lectureIndex === -1) {
      return next(new AppError('Lecture does not exist.', 404));
    }

    // Delete the lecture from cloudinary
    await cloudinary.v2.uploader.destroy(
      course.lectures[lectureIndex].lecture.public_id,
      {
        resource_type: 'video',
      }
    );

    // Remove the lecture from the array
    course.lectures.splice(lectureIndex, 1);

    // update the number of lectures based on lectres array length
    course.numberOfLectures = course.lectures.length;

    // Save the course object
    await course.save();

    // Return response
    res.status(200).json({
      success: true,
      message: 'Course lecture removed successfully',
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourseById,
  deleteCourseById,
  addLectureToCourseById,
  removeLectureFromCourse

}