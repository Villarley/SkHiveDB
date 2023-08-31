// classController.ts
import { Request, Response } from "express";
import { Op } from "sequelize"; // Op is an operator of Sequelize
// My models
import {Class} from "../models/Classroom/class";
import {ProfessorClass} from "../models/Classroom/professor_class";
import {StudentClass} from "../models/Classroom/student_class";
//Util functions
import { generateRandomCode } from "../utils/generateCode";

// Controller to get all classes
export const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await Class.findAll();
    res.json(classes);
  } catch (error) {
    console.error("Error getting classes:", error);
    res.status(500).json({ msg: "Error getting classes" });
  }
};

// Controller to get class details by its ID
export const getClassById = async (req: Request, res: Response) => {
  const classId = parseInt(req.params.id);

  try {
    const classDetails = await Class.findByPk(classId, {
      include: [
        {
          model: StudentClass,
          attributes: ["StudentEmail"],
        },
        {
          model: ProfessorClass,
          attributes: ["ProfessorEmail"],
        },
      ],
    });

    if (!classDetails) {
      res.status(404).json({ msg: "Class not found" });
      return;
    }

    res.json(classDetails);
  } catch (error) {
    console.error("Error getting class details:", error);
    res.status(500).json({ msg: "Error getting class details" });
  }
};

// Controller to create a new class
export const createClass = async (req: Request, res: Response) => {
  // Always send the email here
  const { name, email } = req.body;

  try {
    // Create a new entry in the "classes" table using the Class model
    let newCode;
    let isCodeUnique = false;

    // Generate a new random code and check its uniqueness in the database
    while (!isCodeUnique) {
      newCode = generateRandomCode();
      const existingClass = await Class.findOne({
        where: {
          code: {
            [Op.iLike]: newCode,
          },
        },
      });

      if (!existingClass) {
        isCodeUnique = true;
      }
    }
    // Create the class
    const newClass = await Class.create({
      name,
      code: newCode,
    });
    // Associate the professor who created the class with it
    const professorEmail = email; // We assume that the professor is authenticated, and their information is available in req.user
    await ProfessorClass.create({
      ProfessorEmail: professorEmail,
      ClassId: newClass.id,
    });

    res.json(newClass);
  } catch (error) {
    console.error("Error creating the class:", error);
    res.status(500).json({ msg: "Error creating the class" });
  }
};

// Controller to update an existing class by its ID
export const updateClass = async (req: Request, res: Response) => {
  const classId = parseInt(req.params.id);
  const { name } = req.body;

  try {
    // Find the class by its ID
    const classToUpdate = await Class.findByPk(classId);

    if (!classToUpdate) {
      res.status(404).json({ msg: "Class not found" });
      return;
    }

    // Update the class data
    classToUpdate.name = name;
    await classToUpdate.save();

    res.json(classToUpdate);
  } catch (error) {
    console.error("Error updating the class:", error);
    res.status(500).json({ msg: "Error updating the class" });
  }
};

// Controller to delete a class by its ID
export const deleteClass = async (req: Request, res: Response) => {
  const classId = parseInt(req.params.id);

  try {
    // Find the class by its ID
    const classToDelete = await Class.findByPk(classId);

    if (!classToDelete) {
      res.status(404).json({ msg: "Class not found" });
      return;
    }

    // Delete the class
    await classToDelete.destroy();

    res.json({ msg: "Class deleted successfully." });
  } catch (error) {
    console.error("Error deleting the class:", error);
    res.status(500).json({ msg: "Error deleting the class" });
  }
};

// Controller to associate a student with a class
export const addStudentToClass = async (req: Request, res: Response) => {
  const { studentEmail, classCode } = req.body; // Remove 'classId' as we'll use 'classCode'

  try {
    // Check if the class exists using the provided class code
    const classFound = await Class.findOne({
      where: {
        code: {
          [Op.iLike]: classCode,
        },
      },
    });

    if (!classFound) {
      res.status(404).json({ msg: "Class not found" });
      return;
    }

    // Register the relationship between the student and the class
    await StudentClass.create({
      StudentEmail: studentEmail,
      ClassId: classFound.id,
    });

    res.json({ msg: "Student added to the class successfully." });
  } catch (error) {
    console.error("Error adding the student to the class:", error);
    res.status(500).json({ msg: "Error adding the student to the class" });
  }
};

// Other functions/controllers related to classes
// ...

// Controller to get students in a class
export const getStudentsInClass = async (req: Request, res: Response) => {
  const classCode = req.params.code; // Change 'id' to 'code' in the route

  try {
    // Find the class using the provided code
    const classFound = await Class.findOne({
      where: {
        code: {
          [Op.iLike]: classCode,
        },
      },
    });

    if (!classFound) {
      res.status(404).json({ msg: "Class not found" });
      return;
    }

    // Find all students associated with the found class
    const students = await StudentClass.findAll({
      where: {
        ClassId: classFound.id,
      },
    });

    res.json(students);
  } catch (error) {
    console.error("Error getting students in the class:", error);
    res.status(500).json({ msg: "Error getting students in the class" });
  }
};

// Controller to get classes by a professor's email
export const getClassesByProfessor = async (req: Request, res: Response) => {
  const professorEmail = req.params.id;
  //turning it into a int
  const cuantity = +req.params.cuantity;
  try {
    // Find all classes associated with the professor
    const professorClasses = await ProfessorClass.findAll({
      where: {
        ProfessorEmail: professorEmail,
      },
    });

    // Get the IDs of the associated classes
    const classIds = professorClasses.map(item => item.ClassId);

    // Find class details based on the IDs
    const classes = await Class.findAll({
      where: {
        id: classIds,
      },
      //sorting by last edited
      order: [['updatedAt', 'DESC']],
      limit:cuantity || classIds.length,
    });

    res.json({classes, cuantity});
  } catch (error) {
    console.error("Error getting classes by professor:", error);
    res.status(500).json({ msg: "Error getting classes by professor" });
  }
};
