import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/connection";
import Activity from "./Activity"; // Asegúrate de la ruta correcta
import StudentClass from "./student_class"; // Asegúrate de la ruta correcta

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
    },
    ClassId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: StudentClass, // Referencing StudentClass model
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
