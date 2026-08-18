import { Test, TestingModule } from '@nestjs/testing';
import { ProkeralaService } from './prokerala.service';

describe('ProkeralaService', () => {
  let service: ProkeralaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProkeralaService],
    }).compile();

    service = module.get<ProkeralaService>(ProkeralaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
