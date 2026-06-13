/**
  Automatically validates req.body against a provided Zod schema layout
 @param {ZodObject} schema 
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      
      const formattedErrors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return res.status(400).json({
        msg: "Validation parameters mismatch error",
        errors: formattedErrors
      });
    }


    req.body = result.data;
    next();
  };
};

module.exports = { validateBody };