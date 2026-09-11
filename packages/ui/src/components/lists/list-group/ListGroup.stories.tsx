import type { Meta, StoryObj } from "@storybook/react-native";

import { ListGroup } from "./ListGroup";
import { ListRow } from "../list-row";

const meta = {
  title: "UI/Lists 列表/ListGroup",
  component: ListGroup,
} satisfies Meta<typeof ListGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Account",
    children: (
      <>
        <ListRow title="Profile" value="Edit" isLink onPress={() => {}} showDivider />
        <ListRow title="Devices" isLink onPress={() => {}} />
      </>
    ),
  },
};

export const FullBleed: Story = {
  name: "inset=false",
  args: {
    title: "通栏",
    inset: false,
    children: (
      <>
        <ListRow title="Profile" value="Edit" showDivider />
        <ListRow title="Devices" />
      </>
    ),
  },
};
