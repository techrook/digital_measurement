import { Test, TestingModule } from '@nestjs/testing';
import { Measurement } from './measurement.service';

describe('Measurement', () => {
  let provider: Measurement;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Measurement],
    }).compile();

    provider = module.get<Measurement>(Measurement);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
