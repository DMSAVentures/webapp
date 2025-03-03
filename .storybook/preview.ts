import type { Preview } from "@storybook/react";

import "src/globalstyles/v2/reset.scss";
import "src/globalstyles/v2/typography.scss";
import "src/globalstyles/v2/theme.scss";
import "src/globalstyles/module_variables.scss";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  tags: ["autodocs"]
};

export default preview;
