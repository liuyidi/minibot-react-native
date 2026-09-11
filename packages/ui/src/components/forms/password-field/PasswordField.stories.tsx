import type { Meta, StoryObj } from "@storybook/react-native";
import { PasswordField } from "./PasswordField";

const meta = {
  title: "UI/Forms 表单/PasswordField",
  component: PasswordField,
} satisfies Meta<typeof PasswordField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Password",
    placeholder: "••••••••",
  },
};
