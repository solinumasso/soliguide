import { transformContainersAtPath } from './object-path.utils';

describe('object-path utils', () => {
  it('transforms a cloned payload and preserves the original value', async () => {
    const payload = {
      results: [{ name: 'Maison Solidaire' }],
    };

    const transformed = await transformContainersAtPath(
      payload,
      '/results/*',
      async (container) => {
        container.name = String(container.name).toUpperCase();
      },
    );

    expect(transformed).toEqual({
      results: [{ name: 'MAISON SOLIDAIRE' }],
    });
    expect(payload).toEqual({
      results: [{ name: 'Maison Solidaire' }],
    });
  });
});
