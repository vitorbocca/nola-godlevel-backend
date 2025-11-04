import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NOLA GodLevel Backend API',
      version: '1.0.0',
      description: 'API para dashboard de vendas com métricas detalhadas',
      contact: {
        name: 'NOLA GodLevel Team',
        email: 'contato@nola.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Mensagem de erro'
            },
            details: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Detalhe do erro 1', 'Detalhe do erro 2']
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Dados da resposta'
            }
          }
        },
        DashboardMetrics: {
          type: 'object',
          properties: {
            averageTicket: {
              type: 'object',
              properties: {
                average_ticket: {
                  type: 'string',
                  example: '358.54'
                },
                total_sales: {
                  type: 'string',
                  example: '534079'
                },
                total_revenue: {
                  type: 'string',
                  example: '191491036.18'
                }
              }
            },
            topProducts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    example: 169
                  },
                  product_name: {
                    type: 'string',
                    example: 'Lasanha G #003'
                  },
                  total_quantity_sold: {
                    type: 'number',
                    example: 15014
                  },
                  total_revenue: {
                    type: 'number',
                    example: 1608149.54
                  },
                  total_sales_count: {
                    type: 'string',
                    example: '7525'
                  },
                  average_price: {
                    type: 'number',
                    example: 107.11
                  }
                }
              }
            },
            revenueByHour: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  hour: {
                    type: 'integer',
                    example: 12
                  },
                  sales_count: {
                    type: 'integer',
                    example: 15
                  },
                  total_revenue: {
                    type: 'string',
                    example: '382.50'
                  },
                  average_ticket: {
                    type: 'string',
                    example: '25.50'
                  }
                }
              }
            },
            revenueByDay: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  day_of_week: {
                    type: 'integer',
                    example: 1
                  },
                  day_name: {
                    type: 'string',
                    example: 'Segunda'
                  },
                  sales_count: {
                    type: 'integer',
                    example: 20
                  },
                  total_revenue: {
                    type: 'string',
                    example: '510.00'
                  },
                  average_ticket: {
                    type: 'string',
                    example: '25.50'
                  }
                }
              }
            },
            salesByChannel: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  channel_id: {
                    type: 'integer',
                    example: 1
                  },
                  channel_name: {
                    type: 'string',
                    example: 'Presencial'
                  },
                  channel_type: {
                    type: 'string',
                    example: 'P'
                  },
                  sales_count: {
                    type: 'string',
                    example: '100'
                  },
                  total_revenue: {
                    type: 'string',
                    example: '2550.00'
                  },
                  average_ticket: {
                    type: 'string',
                    example: '25.50'
                  },
                  total_delivery_fees: {
                    type: 'string',
                    example: '0.00'
                  }
                }
              }
            }
          }
        },
        Sale: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            store_id: {
              type: 'integer',
              example: 1
            },
            sub_brand_id: {
              type: 'integer',
              example: 1
            },
            customer_id: {
              type: 'integer',
              example: 1
            },
            channel_id: {
              type: 'integer',
              example: 1
            },
            cod_sale1: {
              type: 'string',
              example: 'V001'
            },
            cod_sale2: {
              type: 'string',
              example: 'V001-001'
            },
            customer_name: {
              type: 'string',
              example: 'João Silva'
            },
            sale_status_desc: {
              type: 'string',
              example: 'Finalizada'
            },
            total_amount_items: {
              type: 'number',
              example: 25.50
            },
            total_discount: {
              type: 'number',
              example: 2.50
            },
            total_increase: {
              type: 'number',
              example: 0
            },
            delivery_fee: {
              type: 'number',
              example: 5.00
            },
            service_tax_fee: {
              type: 'number',
              example: 0
            },
            total_amount: {
              type: 'number',
              example: 28.00
            },
            value_paid: {
              type: 'number',
              example: 28.00
            },
            production_seconds: {
              type: 'integer',
              example: 300
            },
            delivery_seconds: {
              type: 'integer',
              example: 1800
            },
            people_quantity: {
              type: 'integer',
              example: 2
            },
            discount_reason: {
              type: 'string',
              example: 'Promoção'
            },
            increase_reason: {
              type: 'string',
              example: 'Taxa de entrega'
            },
            origin: {
              type: 'string',
              example: 'POS'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T12:00:00Z'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            brand_id: {
              type: 'integer',
              example: 1
            },
            sub_brand_id: {
              type: 'integer',
              example: 1
            },
            category_id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Big Mac'
            },
            pos_uuid: {
              type: 'string',
              example: 'uuid-123'
            },
            deleted_at: {
              type: 'string',
              format: 'date-time',
              nullable: true
            }
          }
        },
        Store: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            brand_id: {
              type: 'integer',
              example: 1
            },
            sub_brand_id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'McDonald\'s Shopping Center'
            },
            city: {
              type: 'string',
              example: 'São Paulo'
            },
            state: {
              type: 'string',
              example: 'SP'
            },
            district: {
              type: 'string',
              example: 'Centro'
            },
            address_street: {
              type: 'string',
              example: 'Rua das Flores'
            },
            address_number: {
              type: 'integer',
              example: 123
            },
            zipcode: {
              type: 'string',
              example: '01234-567'
            },
            latitude: {
              type: 'number',
              example: -23.5505
            },
            longitude: {
              type: 'number',
              example: -46.6333
            },
            is_active: {
              type: 'boolean',
              example: true
            },
            is_own: {
              type: 'boolean',
              example: false
            },
            is_holding: {
              type: 'boolean',
              example: false
            },
            creation_date: {
              type: 'string',
              format: 'date',
              example: '2024-01-01'
            }
          }
        }
      },
      parameters: {
        StoreId: {
          name: 'store_id',
          in: 'query',
          description: 'ID da loja',
          required: false,
          schema: {
            type: 'integer'
          }
        },
        SubBrandId: {
          name: 'sub_brand_id',
          in: 'query',
          description: 'ID da sub-marca',
          required: false,
          schema: {
            type: 'integer'
          }
        },
        BrandId: {
          name: 'brand_id',
          in: 'query',
          description: 'ID da marca',
          required: false,
          schema: {
            type: 'integer'
          }
        },
        DateFrom: {
          name: 'date_from',
          in: 'query',
          description: 'Data inicial (YYYY-MM-DD)',
          required: false,
          schema: {
            type: 'string',
            format: 'date'
          }
        },
        DateTo: {
          name: 'date_to',
          in: 'query',
          description: 'Data final (YYYY-MM-DD)',
          required: false,
          schema: {
            type: 'string',
            format: 'date'
          }
        },
        Limit: {
          name: 'limit',
          in: 'query',
          description: 'Limite de resultados (1-100)',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100
          }
        },
        Id: {
          name: 'id',
          in: 'path',
          description: 'ID do recurso',
          required: true,
          schema: {
            type: 'integer'
          }
        }
      }
    },
    tags: [
      {
        name: 'Dashboard',
        description: 'Métricas e análises do dashboard'
      },
      {
        name: 'Sales',
        description: 'Gerenciamento de vendas'
      },
      {
        name: 'Products',
        description: 'Gerenciamento de produtos'
      },
      {
        name: 'Stores',
        description: 'Gerenciamento de lojas'
      },
      {
        name: 'Health',
        description: 'Monitoramento da API'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
