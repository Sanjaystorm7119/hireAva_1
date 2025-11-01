import { render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";

function render(ui, { theme = "light", ...options } = {}) {
  function Wrapper({ children }) {
    return (
      <ClerkProvider publishableKey="mock-key">
        <ThemeProvider attribute="class" defaultTheme={theme}>
          {children}
        </ThemeProvider>
      </ClerkProvider>
    );
  }

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...options }),
    user: userEvent.setup(),
  };
}

export * from "@testing-library/react";
export { render };
