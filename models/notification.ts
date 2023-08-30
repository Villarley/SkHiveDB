import { DataTypes, Model, Sequelize } from 'sequelize';

class Notification extends Model {
    public id!: number;
    public ActivityClassId!: number;
    public ReminderId!: number;
    public read!: boolean;
}

const initModel = (sequelize: Sequelize) => {
    Notification.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        ActivityClassId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: 'activity_classes', // nombre de la tabla, no del modelo
                key: 'id'
            }
        },
        ReminderId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: 'reminders', // nombre de la tabla, no del modelo
                key: 'id'
            }
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'notifications',
        sequelize: sequelize, // this bit is important
    });
};

export { Notification, initModel };
