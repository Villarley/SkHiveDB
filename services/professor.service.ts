import { Person } from "../models/person";
import { Professor } from "../models/professor";

class ProfessorService{
    async getProfessorInfo(email:string): Promise<any> {
        const professorInfo = await Professor.findOne(
            {where: {email:email},
            include: Person,
        }
            )
        return professorInfo;
    }
}
export default new ProfessorService;