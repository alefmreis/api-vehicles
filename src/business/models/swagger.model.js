const env = require('../../_shared/application.environment');

module.exports = {
  "swagger": "2.0",
  "info": {
    "description": "Vehicle MVP API",
    "version": "1.0.0",
    "title": "Vehicle API"
  },
  "basePath": "/api",
  "host": `localhost:${env.port}`,
  "components": {
    "securitySchemes": {
      "basicAuth": {
        "type": "basic"
      }
    }
  },
  "paths": {
    "/brands/": {
      "get": {
        "tags": [
          "Brands"
        ],
        "description": "Get Brands",
        "operationId": "getBrands",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "offset",
            "in": "query",
            "required": true,
            "type": "integer"
          },
          {
            "name": "limit",
            "in": "query",
            "required": true,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          }
        }
      },
      "post": {
        "tags": [
          "Brands"
        ],
        "description": "Create Brand",
        "operationId": "createBrand",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "Body",
            "in": "body",
            "description": "Body",
            "required": true,
            "type": "string",
            "schema": {
              "$ref": "#/definitions/BrandRequestBody"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Successful operation"
          },
          "401": {
            "description": "Unauthorized"
          },
          "409": {
            "description": "Resource already exists"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      }
    },
    "/brands/{brandId}": {
      "get": {
        "tags": [
          "Brands"
        ],
        "description": "Get Brand by Id",
        "operationId": "getBrandById",
        "produces": [
          "application/json"
        ],
        "parameters": [{
          "name": "brandId",
          "in": "path",
          "description": "Brand id",
          "required": true,
          "type": "integer"
        }],
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Resource Not Found"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      },
      "put": {
        "tags": [
          "Brands"
        ],
        "description": "Update Brand",
        "operationId": "updateBrand",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "brandId",
            "in": "path",
            "description": "Brand id",
            "required": true,
            "type": "integer"
          },
          {
            "name": "Body",
            "in": "body",
            "description": "Body",
            "required": true,
            "type": "string",
            "schema": {
              "$ref": "#/definitions/BrandRequestBody"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Resource Not Found"
          },
          "409": {
            "description": "Resource already exists"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      },
      "delete": {
        "tags": [
          "Brands"
        ],
        "description": "Delete Brand by Id",
        "operationId": "deleteBrandById",
        "produces": [
          "application/json"
        ],
        "parameters": [{
          "name": "brandId",
          "in": "path",
          "description": "Brand id",
          "required": true,
          "type": "integer"
        }],
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Resource Not Found"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      }
    },
    "/models/": {
      "get": {
        "tags": [
          "Models"
        ],
        "description": "Get Models",
        "operationId": "getModels",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "offset",
            "in": "query",
            "required": true,
            "type": "integer"
          },
          {
            "name": "limit",
            "in": "query",
            "required": true,
            "type": "integer"
          },
          {
            "name": "brandId",
            "in": "query",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          }
        }
      },
      "post": {
        "tags": [
          "Models"
        ],
        "description": "Create Model",
        "operationId": "createModel",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "Body",
            "in": "body",
            "description": "Body",
            "required": true,
            "type": "string",
            "schema": {
              "$ref": "#/definitions/ModelRequestBody"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Successful operation"
          },
          "401": {
            "description": "Unauthorized"
          },
          "409": {
            "description": "Resource already exists"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      }
    },
    "/models/{modelId}": {
      "get": {
        "tags": [
          "Models"
        ],
        "description": "Get Model by Id",
        "operationId": "getModelById",
        "produces": [
          "application/json"
        ],
        "parameters": [{
          "name": "modelId",
          "in": "path",
          "description": "Model id",
          "required": true,
          "type": "integer"
        }],
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Resource Not Found"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      },
      "put": {
        "tags": [
          "Models"
        ],
        "description": "Update Model",
        "operationId": "updateModel",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "modelId",
            "in": "path",
            "description": "Model id",
            "required": true,
            "type": "integer"
          },
          {
            "name": "Body",
            "in": "body",
            "description": "Body",
            "required": true,
            "type": "string",
            "schema": {
              "$ref": "#/definitions/ModelRequestBody"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Resource Not Found"
          },
          "409": {
            "description": "Resource already exists"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      },
      "delete": {
        "tags": [
          "Models"
        ],
        "description": "Delete Model by Id",
        "operationId": "deleteModelById",
        "produces": [
          "application/json"
        ],
        "parameters": [{
          "name": "modelId",
          "in": "path",
          "description": "Model id",
          "required": true,
          "type": "integer"
        }],
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Resource Not Found"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      }
    },
    "/vehicles/": {
      "get": {
        "tags": [
          "Vehicles"
        ],
        "description": "Get Vehicles",
        "operationId": "getVehicles",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "offset",
            "in": "query",
            "required": true,
            "type": "integer"
          },
          {
            "name": "limit",
            "in": "query",
            "required": true,
            "type": "integer"
          },
          {
            "name": "modelId",
            "in": "query",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          }
        }
      },
      "post": {
        "tags": [
          "Vehicles"
        ],
        "description": "Create Vehicle",
        "operationId": "createVehicle",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "Body",
            "in": "body",
            "description": "Body",
            "required": true,
            "type": "string",
            "schema": {
              "$ref": "#/definitions/VehicleRequestBody"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Successful operation"
          },
          "401": {
            "description": "Unauthorized"
          },
          "409": {
            "description": "Resource already exists"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      }
    },
    "/vehicle/{vehicleId}": {
      "get": {
        "tags": [
          "Vehicles"
        ],
        "description": "Get Vehicle by Id",
        "operationId": "getVehicleById",
        "produces": [
          "application/json"
        ],
        "parameters": [{
          "name": "vehicleId",
          "in": "path",
          "description": "Vehicle id",
          "required": true,
          "type": "integer"
        }],
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Resource Not Found"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      },
      "put": {
        "tags": [
          "Vehicles"
        ],
        "description": "Update Vehicle",
        "operationId": "updateVehicle",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "vehicleId",
            "in": "path",
            "description": "Vehicle id",
            "required": true,
            "type": "integer"
          },
          {
            "name": "Body",
            "in": "body",
            "description": "Body",
            "required": true,
            "type": "string",
            "schema": {
              "$ref": "#/definitions/VehicleRequestBody"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Resource Not Found"
          },
          "409": {
            "description": "Resource already exists"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      },
      "delete": {
        "tags": [
          "Vehicles"
        ],
        "description": "Delete Vehicle by Id",
        "operationId": "deleteVehicleById",
        "produces": [
          "application/json"
        ],
        "parameters": [{
          "name": "vehicleId",
          "in": "path",
          "description": "Vehicle id",
          "required": true,
          "type": "integer"
        }],
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Resource Not Found"
          }
        },
        "security": [
          {
            "basicAuth": []
          }
        ]
      }
    }
  },
  "definitions": {
    "BrandRequestBody": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        }
      }
    },
    "ModelRequestBody": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "brand_id": {
          "type": "integer"
        }
      }
    },
    "VehicleRequestBody": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        },
        "model_id": {
          "type": "integer"
        },
        "year_model": {
          "type": "integer"
        },
        "fuel": {
          "type": "string",
          "enum": ["GASOLINA", "ETANOL", "FLEX"],
        }
      }
    }
  }
}