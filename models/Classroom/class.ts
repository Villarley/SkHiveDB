import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/connection";
import ProfessorClass from "./professor_class";
import Professor from "../professor";
import { configureAssociations } from "./associations";

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
    modelName: 'Class',
    tableName: 'class',
    timestamps: false,
  }
  );
  // configureAssociations();
  
// Configura la asociación con Professor a través de ProfessorClass
// Class.belongsToMany(Professor, {
  //   through: ProfessorClass,
  //   foreignKey: "ClassId", // Esta es la clave foránea en la tabla ProfessorClass
  // });
  export default Class;
  