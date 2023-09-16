import { DataTypes, Model, Sequelize } from 'sequelize';

class Notification extends Model {
    public id!: number;
    public ActivityClassId!: number;
    public ReminderId!: number;
    public read!: boolean;
    public tokenDevice!: string;
}

const initModel = (sequelize: Sequelize) => {
    Notification.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ActivityClassId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'activity_class', 
                key: 'id'
            }
        },
        ReminderId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'reminders',
                key: 'id'
            }
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        tokenDevice:{
            type: DataTypes.STRING,
            allowNull:false,
        },
    }, {
        tableName: 'notifications',
        sequelize: sequelize, // this bit is important
    });
};

export { Notification, initModel };
