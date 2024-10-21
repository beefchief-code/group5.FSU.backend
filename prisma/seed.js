const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");

const seed = async (numDepartments = 5, numProfessors = 10) => {
  //create departments, create professors
  for (let i = 0; i < numDepartments; i++) {
    const professors = Array.from({ length: numProfessors }, () => {
      const name = faker.word.noun();
      return {
        name,
        bio: faker.lorem.sentence(),
        profileImage: "https://picsum.photos/200/300",
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
      };
    });

    await prisma.department.create({
      data: {
        name: faker.word.noun(),
        description: faker.lorem.sentence(),
        image: "https://picsum.photos/200/300",
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        professors: { create: professors },
      },
    });
  }
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

//profileImage = https://picsum.photos/200[width]/300[height]
