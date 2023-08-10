  import { DataTypes, Model } from "sequelize";
  import sequelize from "../../db/connection";
  import Professor from "../professor"; // Asegúrate de importar correctamente la clase Professor
  import Class from "./class"; // Asegúrate de importar correctamente la clase Class
  import { configureAssociations } from "./associations";

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
