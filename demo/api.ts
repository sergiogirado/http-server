import { HttpRoutePrefix, HttpGet } from '../src/core/api';

@HttpRoutePrefix('api/demo')
export class SimpleApi {

  @HttpGet('values')
  getValues() {
    return ['foo', 'bar'];
  }

  @HttpGet('values/async')
  getValuesAsync() {
    return Promise.resolve(['val 1', 'val 2']);
  }
}

