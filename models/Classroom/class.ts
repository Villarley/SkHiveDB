import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/connection";
import Activity from "./Activity"; // Asegúrate de la ruta correcta
import ActivityClass from "./ActivityClass";

class Class extends Model {
  public id!: number;
  public name!: string;
  public code!: string;
}

Class.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Class",
    tableName: "class",
    timestamps: true,
  }
);
// Class.belongsToMany(Activity, {
//   through: ActivityClass,
//   foreignKey: "ClassId",
//   as: "Activities", // Definimos un alias para la asociación
// });
export default Class;
