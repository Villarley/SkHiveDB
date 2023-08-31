import { DataTypes, Model, Sequelize } from "sequelize";
import { Activity } from "./Activity";
import { StudentClass } from "./student_class";

class ActivityStudents extends Model {
    public id!: number;
    public ActivityId!: number;
    public ClassId!: number;
}

const initModel = (sequelize: Sequelize) => {
    ActivityStudents.init({
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
                model: 'student_class',
                key: 'ClassId'
            }
        },
        grade: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    }, {
        tableName: 'activity_students',
        sequelize: sequelize,
    });
};

export { ActivityStudents, initModel };
