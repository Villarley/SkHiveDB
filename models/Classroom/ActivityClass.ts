import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/connection";
import Activity from "./Activity"; // Asegúrate de la ruta correcta
import Class from "./class"; // Asegúrate de la ruta correcta

class ActivityClass extends Model {
  public id!: number;
  public ActivityId!: number;
  public ClassId!: number;
  public DateToComplete!: Date | null;
}

ActivityClass.init(
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
    },
    DateToComplete: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ActivityClass',
    tableName: 'activity_class',
    timestamps: true,
  }
);

export default ActivityClass;
