import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/connection";
import Class from "./class";
import { configureAssociations } from "./associations";

// Define the Activity model
class Activity extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public Skills!: string;
  public Time!: string;
  public DateToComplete!: Date;
  public ClassId!: number | null; // Allowing null values

  // Additional fields for the Activity entity can be added here
}

// Initialize the Activity model
Activity.init(
  {
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    Time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    DateToComplete: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ClassId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Class,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Activity',
    tableName: 'activity',
    timestamps: true,
  }
);

// Configure any necessary associations here
// configureAssociations();

// Export the Activity model
export default Activity;
