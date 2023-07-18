// person.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

class Person extends Model {
  public email!: string;
  public name!: string;
  public surnames!: string;
  public password!: string;
  public state!: boolean;
  public google!: boolean; // Agrega el campo de google

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
    google: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Valor por defecto para google (no es de Google)
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
