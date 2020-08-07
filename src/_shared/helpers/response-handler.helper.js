const httpStatus = require('http-status');

class ResponseHandler {
  onSuccess(meta, data, ctx) {
    ctx.status = httpStatus.OK;
    ctx.body = (typeof meta.totalItems === 'number') ? { meta, data } : { data };
  }

  onCreated(data = {}, ctx) {
    ctx.status = httpStatus.CREATED;
    ctx.body = Object.assign(data);
  }

  onUpdated(data = {}, ctx) {
    ctx.status = httpStatus.OK;
    ctx.body = Object.assign(data);
  }

  onUnprocessableEntity(data, ctx) {
    ctx.status = httpStatus.UNPROCESSABLE_ENTITY;
    ctx.body = Object.assign(data);
  }

  onNotFound(data, ctx) {
    ctx.status = httpStatus.NOT_FOUND;
    ctx.body = Object.assign(data);
  }

  onBadRequest(data = {}, ctx) {
    ctx.status = httpStatus.BAD_REQUEST;
    ctx.body = Object.assign(data);
  }

  onError(ctx) {
    ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = { message: 'Oopsss something went wrong, we are working to resolve this.' };
  }

  onConflict(data = {}, ctx) {
    ctx.status = httpStatus.CONFLICT;
    ctx.body = Object.assign(data);
  }

  onNoContent(ctx) {
    ctx.status = httpStatus.NO_CONTENT;
  }
}

module.exports = new ResponseHandler();