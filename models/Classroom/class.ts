import { DataTypes, Model, Sequelize } from "sequelize";

class Class extends Model {
    public id!: string;  // Change the type to string for UUID
    public name!: string;
    public code!: string;
    public section!: string;
}

const initModel = (sequelize: Sequelize) => {
    Class.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        section: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'class',
        sequelize: sequelize,
    });
};

export { Class, initModel };
