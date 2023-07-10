import { Router } from "express";
import {
    getPerson,
    getPersons,
    postPerson,
    deletePerson,
    putPerson,
} from "../controllers/person.controller";

const router = Router();

router.get("/:id",      getPerson);
router.get("/",         getPersons);
router.post("/",        postPerson);
router.put("/:id",      putPerson);
router.delete("/:id",   deletePerson);

export default router;
