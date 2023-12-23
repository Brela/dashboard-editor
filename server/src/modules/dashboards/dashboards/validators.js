import Joi from "joi";

const dashboardCreateSchema = Joi.object({
  name: Joi.string().required(),
});

const dashboardUpdateSchema = Joi.object({
  name: Joi.string(),
  isDefault: Joi.boolean(),
});

const dashboardOrderSchema = Joi.array().items(
  Joi.object().keys({
    name: Joi.string().valid("asc", "desc"),
    createdAt: Joi.string().valid("asc", "desc"),
  }),
);

export { dashboardCreateSchema, dashboardUpdateSchema, dashboardOrderSchema };
