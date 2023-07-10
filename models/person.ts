import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

class Person extends Model {
  public email!: string;
  public name!: string;
  public surnames!: string;
  public password!: string;
}

Person.init(
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surnames: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Person',
    tableName: 'person',
    timestamps: false,
  }
);

export default Person;
