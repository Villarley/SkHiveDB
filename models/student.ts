import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';
import Person from './person';

class Student extends Model {
  public email!: string;
}

Student.init(
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
    modelName: 'Student',
    tableName: 'student',
    timestamps: false,
  }
);

export default Student;
