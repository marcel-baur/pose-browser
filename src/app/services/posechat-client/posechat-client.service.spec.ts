import { TestBed } from '@angular/core/testing';

import { PosechatClientService } from './posechat-client.service';

describe('PosechatClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PosechatClientService = TestBed.get(PosechatClientService);
    expect(service).toBeTruthy();
  });
});
