import prisma from "../../config/prismaClient.js";

export const createSeedDataForUser = async (req, res) => {
  let userId = req?.user?.id;
  const seedUserId = process.env.DEMO_USER_ID;

  // Get all dashboards of the seed user
  const seedDashboards = await prisma.dashboard.findMany({
    where: {
      userId: seedUserId,
    },
    include: {
      widgets: true, // Include the widgets of each dashboard
    },
  });

  console.log("seedDashboards: ", seedDashboards);
  // For each dashboard of the seed user
  for (const seedDashboard of seedDashboards) {
    // Destructure the id property out of the seedDashboard object
    const { id, ...dashboardWithoutId } = seedDashboard;

    // Create a new dashboard for the new user
    const newDashboard = await prisma.dashboard.create({
      data: {
        ...dashboardWithoutId,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    console.log("Created dashboard:", newDashboard);

    // For each widget of the seed dashboard
    for (const seedWidget of seedDashboard.widgets) {
      // Destructure the id property out of the seedWidget object
      const { id, ...widgetWithoutId } = seedWidget;

      // Create a new widget for the new dashboard
      const newWidget = await prisma.widget.create({
        data: {
          ...widgetWithoutId,
          dashboard: {
            connect: {
              id: newDashboard.id,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      console.log("Created widget:", newWidget);
    }
  }
  res.json({ message: "Seed data created successfully" });
};
