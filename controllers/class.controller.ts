// classController.ts
import { Request, Response } from "express";
import { Op } from "sequelize"; // Op is an operator of sequelize
//My models
import Class from "../models/Classroom/class";
import ProfessorClass from "../models/Classroom/professor_class";
import StudentClass from "../models/Classroom/student_class";
import { generateRandomCode } from "../utils/generateCode";

// Controller to get all classes
export const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await Class.findAll();
    res.json(classes);
  } catch (error) {
    console.error("Error getting classes:", error);
    res.status(500).json({ message: "Error getting classes" });
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
      res.status(404).json({ message: "Class not found" });
      return;
    }

    res.json(classDetails);
  } catch (error) {
    console.error("Error getting class details:", error);
    res.status(500).json({ message: "Error getting class details" });
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
    
    // Genera un nuevo código aleatorio y verifica su unicidad en la base de datos
    while (!isCodeUnique) {
      newCode = generateRandomCode();
      const existingClass = await Class.findOne({
        where: {
          code: {
            [Op.iLike]: newCode, // Usa iLike para hacer la comparación no case-sensitive
          },
        },
      });
      
      if (!existingClass) {
        isCodeUnique = true;
      }
    }
    //creating the class
    const newClass = await Class.create({
      name,
      code:newCode
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
    res.status(500).json({ message: "Error creating the class" });
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
      res.status(404).json({ message: "Class not found" });
      return;
    }

    // Update the class data
    classToUpdate.name = name;
    await classToUpdate.save();

    res.json(classToUpdate);
  } catch (error) {
    console.error("Error updating the class:", error);
    res.status(500).json({ message: "Error updating the class" });
  }
};

// Controller to delete a class by its ID
export const deleteClass = async (req: Request, res: Response) => {
  const classId = parseInt(req.params.id);

  try {
    // Find the class by its ID
    const classToDelete = await Class.findByPk(classId);

    if (!classToDelete) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    // Delete the class
    await classToDelete.destroy();

    res.json({ message: "Class deleted successfully." });
  } catch (error) {
    console.error("Error deleting the class:", error);
    res.status(500).json({ message: "Error deleting the class" });
  }
};

// Controller to associate a professor with a class
// This function is no longer necessary as we have included the logic to associate the professor with the class at the time of class creation.

// Controller to add a student to a class
export const addStudentToClass = async (req: Request, res: Response) => {
  const { studentEmail, classCode } = req.body; // Eliminamos 'classId' ya que usaremos 'classCode'

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
      res.status(404).json({ message: "Class not found" });
      return;
    }

    // Register the relationship between the student and the class
    await StudentClass.create({
      StudentEmail: studentEmail,
      ClassId: classFound.id,
    });

    res.json({ message: "Student added to the class successfully." });
  } catch (error) {
    console.error("Error adding the student to the class:", error);
    res.status(500).json({ message: "Error adding the student to the class" });
  }
};
export const getStudentsInClass = async (req: Request, res: Response) => {
  const classCode = req.params.code; // Cambia 'id' a 'code' en la ruta

  try {
    // Busca la clase utilizando el código proporcionado
    const classFound = await Class.findOne({
      where: {
        code: {
          [Op.iLike]: classCode,
        },
      },
    });

    if (!classFound) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    // Busca todos los estudiantes asociados a la clase encontrada
    const students = await StudentClass.findAll({
      where: {
        ClassId: classFound.id,
      },
    });

    res.json(students);
  } catch (error) {
    console.error("Error getting students in the class:", error);
    res.status(500).json({ message: "Error getting students in the class" });
  }
};
export const getClassesByProfessor = async (req: Request, res: Response) => {
  const professorEmail = req.params.email; // Cambia 'id' a 'email' en la ruta

  try {
    // Busca todas las clases asociadas al profesor
    const professorClasses = await ProfessorClass.findAll({
      where: {
        ProfessorEmail: professorEmail,
      }
    });
        // Obtiene los IDs de las clases asociadas
        const classIds = professorClasses.map(item => item.ClassId);

        // Busca los detalles de las clases basados en los IDs
        const classes = await Class.findAll({
          where: {
            id: classIds,
          }
        });

    res.json(classes);
  } catch (error) {
    console.error("Error getting classes by professor:", error);
    res.status(500).json({ message: "Error getting classes by professor" });
  }
};
// Other functions/controllers related to classes
// ...
