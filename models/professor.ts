import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';
import Person from './person';

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

export default Professor;
