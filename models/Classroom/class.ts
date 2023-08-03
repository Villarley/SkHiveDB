// class.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/connection";

class Class extends Model {
  public id!: number;
  public name!: string;
}

Class.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Class',
    tableName: 'class',
    timestamps: false,
  }
);

export default Class;
