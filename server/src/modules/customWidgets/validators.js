import Joi from "joi";
import {
  entityOptions,
  criteriaOptions,
} from "../dashboards/widgets/validators.js";

const customWidgetCreateSchema = Joi.object({
  name: Joi.string().required(),
  entity: Joi.string()
    .required()
    .valid(...entityOptions),
  criteria: Joi.string()
    .required()
    .valid(...criteriaOptions),
  displayType: Joi.string().valid("count", "total").required(),
  icon: Joi.string().required(),
  color: Joi.string().required(),
  value: Joi.number(),
  /*   userId: Joi.number().integer().required(),
  companyId: Joi.number().integer().required(), */
});

const customWidgetUpdateSchema = Joi.object({
  name: Joi.string(),
  entity: Joi.string().valid(...entityOptions),
  criteria: Joi.string().valid(...criteriaOptions),
  displayType: Joi.string().valid("count", "total"),
  icon: Joi.string(),
  color: Joi.string(),
  value: Joi.number(),
});

const customWidgetOrderSchema = Joi.array().items(
  Joi.object().keys({
    name: Joi.string().valid("asc", "desc"),
    createdAt: Joi.string().valid("asc", "desc"),
  }),
);

export {
  customWidgetCreateSchema,
  customWidgetUpdateSchema,
  customWidgetOrderSchema,
};
