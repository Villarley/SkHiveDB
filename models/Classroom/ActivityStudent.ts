import { DataTypes, Model, Sequelize } from "sequelize";

class ActivityStudents extends Model {
    public id!: number;
    public ActivityId!: number;
    public StudentClassId!: number;
}

const initModel = (sequelize: Sequelize) => {
    ActivityStudents.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ActivityId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'activity',
                key: 'id'
            }
        },
        StudentClassId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'student_class',
                key: 'id'
            }
        },
        grade: {
            type: DataTypes.JSON,
            allowNull: true
        },
    }, {
        tableName: 'activity_students',
        sequelize: sequelize
    });
};

export { ActivityStudents, initModel };
