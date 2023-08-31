import { DataTypes, Model, Sequelize } from "sequelize";
import { Professor } from "../professor";
import { Class } from "./class";

class ProfessorClass extends Model {
    public ProfessorEmail!: string;
    public ClassId!: number;
}

const initModel = (sequelize: Sequelize) => {
    ProfessorClass.init({
        ProfessorEmail: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'professor',
                key: 'email'
            }
        },
        ClassId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'class',
                key: 'id'
            }
        },
    }, {
        tableName: 'professor_class',
        sequelize: sequelize,
    });
};

export { ProfessorClass, initModel };
