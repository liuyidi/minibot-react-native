import type { Meta, StoryObj } from "@storybook/react-native";
import { Banner } from "./Banner";

const meta = {
  title: "UI/Banner",
  component: Banner,
} satisfies Meta<typeof Banner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "info",
    children: "Heads up — something useful happened.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "Something went wrong.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "All good.",
  },
};
