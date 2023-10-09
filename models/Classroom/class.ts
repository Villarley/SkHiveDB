import { DataTypes, Model, Sequelize } from "sequelize";

class Class extends Model {
    public id!: number;
    public name!: string;
    public code!: string;
}

const initModel = (sequelize: Sequelize) => {
    Class.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        section:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'class',
        sequelize: sequelize,
    });
};

export { Class, initModel };
