import Joi from 'joi';

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const linkSchema = Joi.object({
  title: Joi.string().max(500).allow('').optional(), // Optional - will be auto-extracted
  url: Joi.string().uri().required(),
  description: Joi.string().max(2000).allow('').optional(),
  visibility: Joi.string().valid('public', 'private').default('private'),
  tags: Joi.array().items(Joi.string()).default([])
});

export const updateLinkSchema = Joi.object({
  title: Joi.string().max(500),
  url: Joi.string().uri(),
  description: Joi.string().max(2000),
  visibility: Joi.string().valid('public', 'private'),
  tags: Joi.array().items(Joi.string())
}).min(1);

export function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.validated = value;
    next();
  };
}
