import { DataTypes, Model, Sequelize } from "sequelize";

class StudentClass extends Model {
    public StudentEmail!: string;
    public ClassId!: number;
}

const initModel = (sequelize: Sequelize) => {
    StudentClass.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        StudentEmail: {
            type: DataTypes.STRING,
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
        indexes: [{
            unique: true,
            fields: ['StudentEmail', 'ClassId']
        }]
    });
};

export { StudentClass, initModel };
