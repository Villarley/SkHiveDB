// associations.ts
import Professor from '../professor';
import Class from './class';
import ProfessorClass from './professor_class';

// Configura las asociaciones entre los modelos
export const configureAssociations = () => {
  Professor.belongsToMany(Class, {
    through: ProfessorClass,
    foreignKey: 'ProfessorEmail',
  });

  Class.belongsToMany(Professor, {
    through: ProfessorClass,
    foreignKey: 'ClassId',
  });
};
