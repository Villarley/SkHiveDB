import { DataTypes, Model, Sequelize } from "sequelize";

class Activity extends Model {
    public id!: number;
    public name!: string;
    public description!: string | null;
    public Skills!: string[] | null;
    public Time!: string | null;
    public createdBy!: string; // <-- Agrega este campo
}

const initModel = (sequelize: Sequelize) => {
    Activity.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        Skills: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
        Time: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        generatedActivity:{
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'activity',
        sequelize: sequelize,
    });
};

export { Activity, initModel };
