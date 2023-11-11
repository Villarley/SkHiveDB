import { Activity, ActivityClass, ActivityStudents, StudentClass } from '../models/Classroom';
import sequelize from '../db/connection'; 
import { notificationAssignmentTemplate } from '../utils/emailTemplates';
import { sendEmail } from '../utils/sendEmail';

class ActivityService {
    async createActivity(data: any): Promise<any> {
        const { name, description, Skills, Time, createdBy } = data;
        const transaction = await sequelize.transaction();
    
        try {
            const createdActivity = await Activity.create({
                name,
                description,
                Skills,
                Time,
                createdBy,
                favorite:false,
            }, { transaction });
    
            await transaction.commit();
            return createdActivity;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    
    // Create a new activity and assign it to a class.
    async createAndAssignActivity(data: any, classId: string): Promise<any> {
        const { name, description, Skills, Time, DateToComplete, generatedActivity, professorEmail } = data;
        console.log(data)
        const formattedGrades = Skills.map((skill: any) => ({
            skill,
            grade: 0,
        }));
        const transaction = await sequelize.transaction();

        try {
            let existingActivity: any;

            if (data.id) {
                existingActivity = await Activity.findByPk(data.id);
            }

            if (!existingActivity) {
                existingActivity = await Activity.create({
                    name,
                    description,
                    Skills,
                    Time,
                    DateToComplete,
                    generatedActivity,
                    createdBy:professorEmail,
                    favorite:false,
                }, { transaction });
            }

            const isAssigned = await ActivityClass.findOne({
                where: {
                    ActivityId: existingActivity.id,
                    ClassId: classId,
                },
                transaction,
            });

            if (!isAssigned) {
                await ActivityClass.create({
                    ActivityId: existingActivity.id,
                    ClassId: classId,
                    DateToComplete,
                }, { transaction });
            }

            const studentsInClass = await StudentClass.findAll({
                where: {
                    ClassId: classId,
                },
                transaction,
            });

            const studentActivityPromises = studentsInClass.map(async (student) => {
                const exists = await ActivityStudents.findOne({
                    where: {
                        ActivityId: existingActivity.id,
                        ClassId: student.ClassId,
                        StudentEmail: student.StudentEmail,
                    },
                    transaction,
                });

                if (!exists) {
                    const formattedObjToSendEmail:any = {
                        professorEmail,
                        title: existingActivity.name,
                        description: existingActivity.description,
                        date: DateToComplete,
                        personEmail: student.StudentEmail,
                        classs: student.ClassId,
                    }
                    const formattedEmailTemplate = await notificationAssignmentTemplate(formattedObjToSendEmail)
                    sendEmail(formattedEmailTemplate);
                    return ActivityStudents.create({
                        ActivityId: existingActivity.id,
                        ClassId: student.ClassId,
                        StudentEmail: student.StudentEmail,
                        grade: formattedGrades,
                    }, { transaction });
                }
            });

            await Promise.all(studentActivityPromises);

            await transaction.commit();
            return existingActivity;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // Update an existing activity.
    async updateActivity(id: number, data: any): Promise<any | null> {
        await Activity.update(data, { where: { id } });
        return Activity.findOne({ where: { id } });
    }

    // Delete an activity.
    async deleteActivity(id: number): Promise<void> {
        await Activity.destroy({ where: { id } });
    }
    async getActivitiesByProfessor(createdBy: string): Promise<any[]> {
        try {
            // Utiliza el modelo Activity para buscar todas las actividades con el campo createdBy especificado
            const activities = await Activity.findAll({ where: { createdBy: createdBy } });
            return activities;
        } catch (error) {
            throw error;
        }
    }
}

export default new ActivityService();
