// student_class.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/connection";
import Student from "../student";
import Class from "./class";

class StudentClass extends Model {
  public StudentEmail!: string;
  public ClassId!: number;
}

StudentClass.init(
  {
    StudentEmail: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: Student,
        key: 'email',
      },
    },
    ClassId: {
      type: DataTypes.INTEGER,
      unique: true, // Add this line to define a unique constraint
      references: {
        model: Class,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'StudentClass',
    tableName: 'student_class',
    timestamps: false,
  }
);

export default StudentClass;
