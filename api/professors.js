const express = require("express");
const router = express.Router();

const prisma = require("../prisma");
module.exports = router;
// Authenticate middleware
const { authenticate } = require("./auth");

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const professors = await prisma.professor.findMany({
        include: { department: true },
      });
      res.json(professors);
    } catch (e) {
      next(e);
    }
  })
  .post(authenticate, async (req, res, next) => {
    try {
      const { name, bio, profileImage, email, phoneNumber, departmentId } =
        req.body;
      const professor = await prisma.professor.create({
        data: { name, bio, profileImage, email, phoneNumber, departmentId },
      });
      res.status(201).json(professor);
    } catch (e) {
      next(e);
    }
  });

router.param("id", async (req, res, next, id) => {
  try {
    const professor = await prisma.professor.findUniqueOrThrow({
      where: { id: +id },
      include: { department: true },
    });
    if (professor) {
      req.professor = professor;
      next();
    } else {
      next({ status: 404, message: `Professor id ${id} does not exist.` });
    }
  } catch (e) {
    next(e);
  }
});

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      res.json(req.professor);
    } catch (e) {
      next(e);
    }
  })
  .put(authenticate, async (req, res, next) => {
    try {
      const { name, bio, profileImage, email, phoneNumber, departmentId } = req.body;
      const professor = await prisma.professor.update({
        where: { id: req.professor.id },
        data: { name, bio, profileImage, email, phoneNumber, departmentId },
      });
      res.status(200).json(professor);
    } catch (e) {
      next(e);
    }
  })
  .delete(authenticate, async (req, res, next) => {
    try {
      await prisma.professor.delete({
        where: { id: req.professor.id },
      });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });
