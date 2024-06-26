import { DataTypes, Model, Sequelize } from "sequelize";
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
        grade: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull: true,
        },
        StudentEmail:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        feedBack:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'activity_students',
        sequelize: sequelize,
    });
};

export { ActivityStudents, initModel };
