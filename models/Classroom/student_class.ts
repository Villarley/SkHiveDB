import { DataTypes, Model, Sequelize } from "sequelize";

class StudentClass extends Model {
    public id!: number;  // Agregamos el id aquí
    public StudentEmail!: string;
    public ClassId!: number;
}

const initModel = (sequelize: Sequelize) => {
    StudentClass.init({
        StudentEmail: {
            type: DataTypes.STRING,
            references: {
                model: 'student',
                key: 'email'
            }
        },
        ClassId: {
            type: DataTypes.UUID,
            references: {
                model: 'class',
                key: 'id'
            },
        },
    }, {
        tableName: 'student_class',
        sequelize: sequelize,
    });
};

export { StudentClass, initModel };
