// professor_class.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/connection";
import Professor from "../professor";
import Class from "./class";

class ProfessorClass extends Model {
  public ProfessorEmail!: string;
  public ClassId!: number;
}

ProfessorClass.init(
  {
    ProfessorEmail: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: Professor,
        key: 'email',
      },
    },
    ClassId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Class,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'ProfessorClass',
    tableName: 'professor_class',
    timestamps: false,
  }
);

export default ProfessorClass;
