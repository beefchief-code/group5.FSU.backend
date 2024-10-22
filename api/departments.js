//get all, get :id, auth push new dept, auth delete dept:id, auth mutate dept

const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");

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

//AUTH push new dept
router.post("/", authenticate, async (req, res, next) => {
  const { name, description, image, email, phoneNumber, professorIds } =
    req.body;
  try {
    const professors = professorIds.map((id) => ({ id }));
    const department = await prisma.department.create({
      data: {
        name,
        description,
        image,
        email,
        phoneNumber,
        professors: { connect: professors },
      },
    });
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

//AUTH modify dept
router.put(authenticate, async (req, res, next) => {
  try {
    const { name, description, image, email, phoneNumber, professorIds } =
      req.body;
    const department = await prisma.department.update({
      where: { id: req.department.id },
      data: { name, description, image, email, phoneNumber, professorIds },
    });
    res.status(200).json(department);
  } catch (e) {
    next(e);
  }
});

//AUTH delete dept
router.delete(authenticate, async (req, res, next) => {
  try {
    await prisma.department.delete({
      where: { id: req.department.id },
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});
