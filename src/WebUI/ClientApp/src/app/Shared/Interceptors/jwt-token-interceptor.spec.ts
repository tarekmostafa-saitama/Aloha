import { JwtTokenInterceptor } from './jwt-token-interceptor';

describe('JwtTokenInterceptor', () => {
  it('should create an instance', () => {
    expect(new JwtTokenInterceptor()).toBeTruthy();
  });
});
