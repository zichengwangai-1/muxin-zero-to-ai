import { describe, expect, it } from 'vitest';

import { createConfig } from './cms-config.mjs';

describe('CMS GitHub authentication', () => {
  it('requests access to public repositories only', () => {
    const config = createConfig({ branch: 'main' });

    expect(config.backend).toMatchObject({
      name: 'github',
      repo: 'zichengwangai-1/muxin-zero-to-ai',
      auth_scope: 'public_repo',
    });
  });
});
