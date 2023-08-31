import { DataTypes, Model, Sequelize } from "sequelize";
import { Student } from "../student";
import { Class } from "./class";

class StudentClass extends Model {
    public StudentEmail!: string;
    public ClassId!: number;
}

const initModel = (sequelize: Sequelize) => {
    StudentClass.init({
        StudentEmail: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'student',
                key: 'email'
            }
        },
        ClassId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'class',
                key: 'id'
            }
        },
    }, {
        tableName: 'student_class',
        sequelize: sequelize,
    });
};

export { StudentClass, initModel };
