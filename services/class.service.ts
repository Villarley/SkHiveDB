import { StudentClass } from "../models/Classroom/student_class";

export class ClassService {
  async deleteStudentClass(studentEmail: string, classId: string) {
    // Check if the relationship between the student and the class exists
    const studentClass = await StudentClass.findOne({
      where: {
        StudentEmail: studentEmail,
        ClassId: classId,
      },
    });

    if (!studentClass) {
      throw new Error("Relación entre estudiante y clase no encontrada");
    }

    // Delete the relationship
    await studentClass.destroy();
    return { message: "Estudiante eliminado de la clase exitosamente." };
  }
}
export default new ClassService();