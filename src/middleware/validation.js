import Joi from 'joi';

// Validação para filtros do dashboard
const validateDashboardFilters = (req, res, next) => {
  const schema = Joi.object({
    store_id: Joi.number().integer().positive().optional(),
    sub_brand_id: Joi.number().integer().positive().optional(),
    brand_id: Joi.number().integer().positive().optional(),
    date_from: Joi.date().iso().optional(),
    date_to: Joi.date().iso().optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
  });

  const { error } = schema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Parâmetros inválidos',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Validação para criação de venda
const validateSale = (req, res, next) => {
  const schema = Joi.object({
    store_id: Joi.number().integer().positive().required(),
    sub_brand_id: Joi.number().integer().positive().optional(),
    customer_id: Joi.number().integer().positive().optional(),
    channel_id: Joi.number().integer().positive().required(),
    cod_sale1: Joi.string().max(100).optional(),
    cod_sale2: Joi.string().max(100).optional(),
    customer_name: Joi.string().max(100).optional(),
    sale_status_desc: Joi.string().max(100).required(),
    total_amount_items: Joi.number().precision(2).positive().required(),
    total_discount: Joi.number().precision(2).min(0).optional(),
    total_increase: Joi.number().precision(2).min(0).optional(),
    delivery_fee: Joi.number().precision(2).min(0).optional(),
    service_tax_fee: Joi.number().precision(2).min(0).optional(),
    total_amount: Joi.number().precision(2).positive().required(),
    value_paid: Joi.number().precision(2).min(0).optional(),
    production_seconds: Joi.number().integer().min(0).optional(),
    delivery_seconds: Joi.number().integer().min(0).optional(),
    people_quantity: Joi.number().integer().min(0).optional(),
    discount_reason: Joi.string().max(300).optional(),
    increase_reason: Joi.string().max(300).optional(),
    origin: Joi.string().max(100).default('POS').optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Validação para criação de produto
const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    brand_id: Joi.number().integer().positive().required(),
    sub_brand_id: Joi.number().integer().positive().optional(),
    category_id: Joi.number().integer().positive().optional(),
    name: Joi.string().max(500).required(),
    pos_uuid: Joi.string().max(100).optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Validação para criação de loja
const validateStore = (req, res, next) => {
  const schema = Joi.object({
    brand_id: Joi.number().integer().positive().required(),
    sub_brand_id: Joi.number().integer().positive().optional(),
    name: Joi.string().max(255).required(),
    city: Joi.string().max(100).optional(),
    state: Joi.string().max(2).optional(),
    district: Joi.string().max(100).optional(),
    address_street: Joi.string().max(200).optional(),
    address_number: Joi.number().integer().positive().optional(),
    zipcode: Joi.string().max(10).optional(),
    latitude: Joi.number().precision(6).optional(),
    longitude: Joi.number().precision(6).optional(),
    is_active: Joi.boolean().optional(),
    is_own: Joi.boolean().optional(),
    is_holding: Joi.boolean().optional(),
    creation_date: Joi.date().iso().optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Validação para ID numérico
const validateId = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number().integer().positive().required()
  });

  const { error } = schema.validate(req.params);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

export {
  validateDashboardFilters,
  validateSale,
  validateProduct,
  validateStore,
  validateId
};

