import { Router, type IRouter } from "express";
import healthRouter from "./health";
import drugsRouter from "./drugs";
import interactionsRouter from "./interactions";
import symptomsRouter from "./symptoms";
import adrReportsRouter from "./adrReports";
import chatbotRouter from "./chatbot";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(drugsRouter);
router.use(interactionsRouter);
router.use(symptomsRouter);
router.use(adrReportsRouter);
router.use(chatbotRouter);
router.use(dashboardRouter);

export default router;
