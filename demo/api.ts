import { HttpApiEndpoint, HttpGet, HttpRoutePrefix } from '../src/core/api';

/**
 * Demo API
 */
@HttpRoutePrefix('api/demo')
export class SimpleApi {

  @HttpGet('values')
  public getValues: HttpApiEndpoint = () => {
    return ['foo', 'bar'];
  }

  @HttpGet('values/:id')
  public getValuesAsync: HttpApiEndpoint = ({ routeParams, queryParams }) => {
    return Promise.resolve({
      id: routeParams.id,
      query: queryParams,
      values: ['val 1', 'val 2']
    });
  }
}
