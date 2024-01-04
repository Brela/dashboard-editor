Note that Orderly, Inventory Copilot, and this Dashboard Editor all use the same AWS RDS database to save resources.

- Orderly and Inventory Copilot use the same tables since inv copilot is an upgrade of orderly,

- The Dashboard Editor has its tables distiguished with a separate schema name in the schema.prisma file
