// person.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

class Person extends Model {
  public email!: string;
  public name!: string;
  public surnames!: string;
  public password!: string;
  public state!: boolean; // Agrega el campo de state

  // ...
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
    state: {
      type: DataTypes.BOOLEAN, // Ajusta el tipo según el tipo de datos de tu base de datos
      defaultValue: true, // Valor por defecto para el state
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
