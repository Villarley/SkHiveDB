// models/reminder.ts
import Person from './person';
import { DataTypes, Model, Sequelize } from 'sequelize';

class Reminder extends Model {
  public id!: number;
  public Date!: Date;
  public description!: string;
  public priority!: string;
  public PersonEmail!: string;

  static initModel(sequelize: Sequelize) {
    return Reminder.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      Date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PersonEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Person', // 'persons' refers to table name
          key: 'email',
        },
      },
    }, {
      tableName: 'reminders',
      sequelize: sequelize,
    });
  }
}

export default Reminder;
