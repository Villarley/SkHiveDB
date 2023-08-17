import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/connection";
import Class from "./class";
import ActivityClass from "./ActivityClass";

class Activity extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public Skills!: string[] | null;
  public Time!: string | null;
}

Activity.init(
  
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    Time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Activity",
    tableName: "activity",
    timestamps: true,
  }
);
// Activity.belongsToMany(Class, {
//   through: ActivityClass,
//   foreignKey: "ActivityId",
//   as: "Classes", // Definimos un alias para la asociación
// });

export default Activity;
