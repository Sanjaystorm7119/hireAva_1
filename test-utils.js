import { render } from "@testing-library/react";
import { ClerkProvider } from "@clerk/nextjs";

const customRender = (ui, options = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <ClerkProvider publishableKey="mock-key">{children}</ClerkProvider>
    ),
    ...options,
  });
};

export * from "@testing-library/react";
export { customRender as render };
