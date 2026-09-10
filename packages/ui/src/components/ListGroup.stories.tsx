import type { Meta, StoryObj } from "@storybook/react-native";

import { ListGroup } from "./ListGroup";
import { ListRow } from "./ListRow";

const meta = {
  title: "UI/ListGroup",
  component: ListGroup,
} satisfies Meta<typeof ListGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Account",
    children: (
      <>
        <ListRow title="Profile" value="Edit" showDivider />
        <ListRow title="Devices" />
      </>
    ),
  },
};
