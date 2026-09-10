import type { Meta, StoryObj } from "@storybook/react-native";
import { TextField } from "./TextField";
import { FormField } from "./FormField";

const meta = {
  title: "UI/FormField",
  component: FormField,
} satisfies Meta<typeof FormField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email",
    error: undefined,
    children: <TextField placeholder="you@example.com" />,
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    error: "Required",
    children: <TextField placeholder="you@example.com" />,
  },
};
