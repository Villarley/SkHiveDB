import { DataTypes, Model, Sequelize } from 'sequelize';
import { Person } from './person';

class Student extends Model {
    public email!: string;
}

const initModel = (sequelize: Sequelize) => {
    Student.init({
        email: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'person',
                key: 'email'
            }
        },
    }, {
        tableName: 'student',
        sequelize: sequelize,
    });
};

export { Student, initModel };
