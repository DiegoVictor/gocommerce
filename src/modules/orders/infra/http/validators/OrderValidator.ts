import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.BODY]: Joi.object().keys({
    customer_id: Joi.string().required(),
    products: Joi.array().items(
      Joi.object().keys({
        id: Joi.string().required(),
        quantity: Joi.number().required(),
      }),
    ),
  }),
});
