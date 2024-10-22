//get all, get :id, auth push new dept, auth delete dept:id, auth mutate dept

const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
//const { authenticate } = require("./auth");

//get all depts
router.get("/", async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (e) {
    next(e);
  }
});

//get dept:id
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const department = await prisma.department.findUniqueOrThrow({
      where: { id: +id },
    });
    res.json(department);
  } catch (e) {
    next(e);
  }
});
