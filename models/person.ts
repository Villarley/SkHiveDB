import { DataTypes, Model, Sequelize } from 'sequelize';

class Person extends Model {
    public email!: string;
    public name!: string;
    public surnames!: string;
    public password!: string;
    public state!: boolean;
    public google!: boolean;
}

const initModel = (sequelize: Sequelize) => {
    Person.init({
        email: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surnames: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        google: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        state: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'person',
        sequelize: sequelize,
    });
};

export { Person, initModel };
