// models/reminder.ts
import { Person } from './person';
import { DataTypes, Model, Sequelize } from 'sequelize';

class Reminder extends Model {
  public id!: number;
  public title!: string;
  public date!: Date;
  public description!: string;
  public priority!: string;
  public personEmail!: string;
  public class!: string;
}
  const initModel = (sequelize: Sequelize) => {
     Reminder.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title:{
        type :DataTypes.STRING
      },
      date: {
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
      personEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'person', // 'persons' refers to table name
          key: 'email',
        },
      },
      class:{
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      tableName: 'reminders',
      sequelize: sequelize,
    });
  }


export { Reminder, initModel };
