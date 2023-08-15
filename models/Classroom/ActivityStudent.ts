// activity_students.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/connection";
import Activity from "./Activity"; // Make sure this path is correct
import StudentClass from "./student_class"; // Make sure this path is correct

class ActivityStudents extends Model {
  public id!: number;
  public ActivityId!: number;
  public ClassId!: number;
}

ActivityStudents.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ActivityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Activity,
        key: 'id', // Reference the id column in the Activity model
      },
    },
    ClassId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: StudentClass,
        key: 'ClassId',
      },
    },
  },
  {
    sequelize,
    modelName: 'ActivityStudents',
    tableName: 'activity_students',
    timestamps: true,
  }
);

export default ActivityStudents;
