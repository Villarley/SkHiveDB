import { DataTypes, Model, Sequelize } from "sequelize";
import { Person } from "./person";

class Professor extends Model {
    public email!: string;
}

const initModel = (sequelize: Sequelize) => {
    Professor.init({
        email: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'person',
                key: 'email'
            }
        },
    }, {
        timestamps: true,
        tableName: 'professor',
        sequelize: sequelize,
    });
};

export { Professor, initModel };
