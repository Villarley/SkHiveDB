import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connection";
import Class from "./Classroom/class"; // Asegúrate de importar correctamente la clase Class
import ProfessorClass from "./Classroom/professor_class"; // Asegúrate de importar correctamente la clase ProfessorClass
import Person from "./person";
import { configureAssociations } from "./Classroom/associations";

// configureAssociations();
class Professor extends Model {
  public email!: string;
}

Professor.init(
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: Person,
        key: 'email',
      },
    },
  },
  {
    sequelize,
    modelName: 'Professor',
    tableName: 'professor',
    timestamps: false,
  }
);

// Configura la asociación con Class a través de ProfessorClass
// Professor.belongsToMany(Class, {
//   through: ProfessorClass,
//   foreignKey: "ProfessorEmail", // Esta es la clave foránea en la tabla ProfessorClass
// });
export default Professor;
