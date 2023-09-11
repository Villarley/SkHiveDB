import { DataTypes, Model, Sequelize } from "sequelize";
import { Activity } from "./Activity";
import { Class } from "./class";

class ActivityClass extends Model {
    public id!: number;
    public ActivityId!: number;
    public ClassId!: number;
    public DateToComplete!: Date | null;
}

const initModel = (sequelize: Sequelize) => {
    ActivityClass.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ActivityId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'activity',
                key: 'id'
            }
        },
        ClassId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'class',
                key: 'id'
            }
        },
        DateToComplete: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'activity_class',
        sequelize: sequelize,
    });
};

export { ActivityClass, initModel };
